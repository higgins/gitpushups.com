const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const { mkdtempSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const { createHash } = require('node:crypto');
const { NextRequest } = require('next/server');
const dir = mkdtempSync(join(process.cwd(), '.auth-tests-'));
after(() => rmSync(dir, { recursive: true, force: true }));
buildSync({ entryPoints: ['src/lib/web-auth.ts'], outfile: join(dir, 'auth.cjs'), bundle: true, platform: 'node', format: 'cjs', packages: 'external', define: { 'process.env.NODE_ENV': '"production"' } });
const auth = require(join(dir, 'auth.cjs'));
const settings = { clientId: 'test-client', redirectUri: 'https://gitpushups.com/auth/callback' };
const req = (path, cookie) => new NextRequest(`https://gitpushups.com${path}`, { headers: cookie ? { Cookie: `${auth.FLOW_COOKIE}=${cookie}` } : {} });

test('browser OAuth round trip uses state, PKCE and secure cookies without exposing tokens in the URL', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: String(url), options });
    return Response.json(options?.method === 'POST' ? { token: 'signed.session.token', expiresIn: auth.SESSION_SECONDS } : settings);
  });
  const start = await auth.startLogin(req('/auth/login'));
  assert.equal(start.status, 303);
  const authorize = new URL(start.headers.get('location'));
  assert.equal(authorize.origin, 'https://github.com');
  assert.equal(authorize.searchParams.get('code_challenge_method'), 'S256');
  const flowCookie = start.cookies.get(auth.FLOW_COOKIE).value;
  const flow = JSON.parse(Buffer.from(flowCookie, 'base64url').toString());
  assert.equal(authorize.searchParams.get('code_challenge'), createHash('sha256').update(flow.verifier).digest('base64url'));
  assert.equal(authorize.searchParams.get('state'), flow.state);
  const response = await auth.finishLogin(req(`/auth/callback?code=code123&state=${flow.state}`, flowCookie));
  assert.equal(response.headers.get('location'), 'https://gitpushups.com/account');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  const session = response.cookies.get(auth.SESSION_COOKIE);
  assert.equal(session.value, 'signed.session.token');
  assert.equal(session.httpOnly, true);
  assert.equal(session.secure, true);
  assert.equal(session.sameSite, 'lax');
  assert.equal(session.path, '/');
  assert.equal(response.cookies.get(auth.FLOW_COOKIE).maxAge, 0);
  assert.equal(JSON.parse(calls[2].options.body).codeVerifier, flow.verifier);
});

test('missing, mismatched and expired state cannot reach token exchange', async t => {
  const network = t.mock.method(globalThis, 'fetch', () => { throw Error('Must not exchange'); });
  const flow = { state: 'a'.repeat(43), verifier: 'b'.repeat(43), createdAt: Date.now() };
  for (const [state, cookie] of [
    ['a'.repeat(43), undefined], ['bad', Buffer.from(JSON.stringify(flow)).toString('base64url')],
    [flow.state, Buffer.from(JSON.stringify({ ...flow, createdAt: Date.now() - 700000 })).toString('base64url')],
    [flow.state, 'not-json'],
  ]) {
    const response = await auth.finishLogin(req(`/auth/callback?code=x&state=${state}`, cookie));
    assert.match(response.headers.get('location'), /\/signup\?error=/);
    assert.equal(response.cookies.get(auth.SESSION_COOKIE), undefined);
  }
  assert.equal(network.mock.callCount(), 0);
});

test('origin mismatch and failed exchanges never create a session; logout requires same origin', async t => {
  const network = t.mock.method(globalThis, 'fetch', async () => Response.json(settings));
  assert.match((await auth.startLogin(new NextRequest('https://attacker.example/auth/login'))).headers.get('location'), /error=configuration/);
  network.mock.restore();
  t.mock.method(globalThis, 'fetch', async (_, options) => options?.method === 'POST' ? new Response('Unauthorized', { status: 401 }) : Response.json(settings));
  const flow = { state: 'a'.repeat(43), verifier: 'b'.repeat(43), createdAt: Date.now() };
  const response = await auth.finishLogin(req(`/auth/callback?code=x&state=${flow.state}`, Buffer.from(JSON.stringify(flow)).toString('base64url')));
  assert.equal(response.cookies.get(auth.SESSION_COOKIE), undefined);
  const rejected = await auth.signOut(new NextRequest('https://gitpushups.com/auth/logout', { method: 'POST', headers: { Origin: 'https://evil.example' } }));
  assert.equal(rejected.status, 403);
  const logout = await auth.signOut(new NextRequest('https://gitpushups.com/auth/logout', { method: 'POST', headers: { Origin: 'https://gitpushups.com' } }));
  assert.equal(logout.cookies.get(auth.SESSION_COOKIE).maxAge, 0);
});
