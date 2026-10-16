const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const { mkdtempSync, rmSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const sharp = require('sharp');

const dir = mkdtempSync(join(process.cwd(), '.profile-social-tests-'));
after(() => rmSync(dir, { recursive: true, force: true }));
for (const [name, entry] of [['model', 'src/lib/profile-social.ts'], ['route', 'app/social/profile/[username]/route.tsx']]) {
  buildSync({ entryPoints: [entry], outfile: join(dir, `${name}.cjs`), bundle: true, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic' });
}
const model = require(join(dir, 'model.cjs'));
const { GET } = require(join(dir, 'route.cjs'));

test('ordinary profile metadata has a distinct public image per user and the original canonical URL', () => {
  const a = model.profileSocialMetadata('higgins');
  const b = model.profileSocialMetadata('octo-cat');
  assert.equal(a.alternates.canonical, 'https://gitpushups.com/@higgins');
  assert.equal(a.openGraph.url, a.alternates.canonical);
  assert.equal(a.twitter.card, 'summary_large_image');
  assert.equal(a.twitter.images[0].url, a.openGraph.images[0].url);
  assert.notEqual(a.openGraph.images[0].url, b.openGraph.images[0].url);
  assert.equal(model.profileSocialMetadata('HIGGINS').openGraph.images[0].url, a.openGraph.images[0].url);
  for (const invalid of ['../higgins', '-bad', 'bad-', 'a'.repeat(40), '<svg>', 'a/b']) assert.deepEqual(model.profileSocialMetadata(invalid), {});
});

test('totals exclude future days and other years; unavailable is different from no activity', () => {
  const data = model.profileContributionSummary({
    '2024-02-29': { reps: 45, goal: 40 }, '2024-03-01': { reps: 400, goal: 40 }, '2023-12-31': { reps: 1000, goal: 40 },
  }, '2024-02-29');
  assert.equal(data.days.length, 366);
  assert.equal(data.total, 45);
  assert.equal(data.activeDays, 1);
  assert.equal(model.profileContributionSummary(null, '2024-02-29').total, null);
  assert.equal(model.profileContributionSummary({}, '2024-02-29').total, 0);
});

test('avatar loading restricts hosts, scheme, size and redirects', async () => {
  for (const url of ['https://example.com/avatar.png', 'http://avatars.githubusercontent.com/u/1', 'https://avatars.githubusercontent.com.evil.test/u/1', 'https://user@avatars.githubusercontent.com/u/1', 'https://avatars.githubusercontent.com:444/u/1', null]) {
    assert.equal(model.githubAvatarUrl(url), null);
  }
  assert.equal(new URL(model.githubAvatarUrl('https://avatars.githubusercontent.com/u/1?v=4')).searchParams.get('s'), '192');
  await assert.rejects(model.readBoundedBody(new Response(new Uint8Array(1025)), 1024), /too large/);
  assert.equal((await model.readBoundedBody(new Response(new Uint8Array(1024)), 1024)).byteLength, 1024);
});

test('image route caches PNGs for one day, ignores daily completion status, and survives missing graph/avatar', async () => {
  const originalFetch = global.fetch;
  const originalCaches = global.caches;
  const symbol = Symbol.for('__cloudflare-context__');
  const originalContext = global[symbol];
  const pending = [];
  const stored = new Map();
  const calls = [];
  let didPushupsToday = false;
  const avatar = await sharp({ create: { width: 32, height: 32, channels: 3, background: '#ed6543' } }).png().toBuffer();
  global.caches = { open: async () => ({
    match: async request => stored.get(request.url)?.clone(),
    put: async (request, response) => { stored.set(request.url, new Response(await response.arrayBuffer(), response)); },
  }) };
  global[symbol] = { env: { ASSETS: { fetch: async request => new Response(readFileSync(join(process.cwd(), 'public', new URL(request.url).pathname))) } }, ctx: { waitUntil: promise => pending.push(promise) } };
  global.fetch = async (input, options) => {
    const url = new URL(String(input)); calls.push(url.toString());
    if (url.hostname === 'avatars.githubusercontent.com') {
      assert.equal(options.redirect, 'manual');
      return new Response(avatar, { headers: { 'Content-Type': 'image/png' } });
    }
    const username = url.pathname.split('/')[2];
    if (username === 'missing') return new Response('', { status: 404 });
    if (url.pathname.endsWith('/contributions')) {
      if (username === 'empty') return new Response('', { status: 503 });
      return Response.json({ contributions: { '2026-10-15': { reps: username === 'higgins' ? 40 : 80, goal: 40 } } });
    }
    return Response.json({ user: { username, avatarUrl: username === 'empty' ? 'https://invalid.example/avatar.png' : 'https://avatars.githubusercontent.com/u/1' }, didPushupsToday, localDate: '2026-10-16' });
  };
  const get = (username, query = '') => GET(new Request(`https://gitpushups.com/social/profile/${username}${query}`, { headers: { Cookie: 'unrelated-session=secret' } }), { params: { username } });
  try {
    const first = await get('higgins');
    assert.equal(first.status, 200);
    assert.equal(first.headers.get('content-type'), 'image/png');
    assert.equal(first.headers.get('cache-control'), 'public, max-age=86400');
    assert.equal(first.headers.get('set-cookie'), null);
    const firstBytes = Buffer.from(await first.arrayBuffer());
    const dimensions = await sharp(firstBytes).metadata();
    assert.equal(dimensions.width, 1200); assert.equal(dimensions.height, 630);
    await Promise.all(pending);
    const callCount = calls.length;
    const cached = await get('HIGGINS', '?v=random&ignored=yes');
    assert.deepEqual(Buffer.from(await cached.arrayBuffer()), firstBytes);
    assert.equal(cached.headers.get('cache-control'), 'public, max-age=86400');
    assert.equal(calls.length, callCount);
    // Bypass the cache and toggle today's status: the rendered design must stay identical.
    stored.clear();
    didPushupsToday = true;
    const completedToday = await get('higgins');
    assert.deepEqual(Buffer.from(await completedToday.arrayBuffer()), firstBytes);
    const second = await get('octo-cat');
    assert.equal(second.status, 200);
    assert.notDeepEqual(Buffer.from(await second.arrayBuffer()), firstBytes);
    const fallback = await get('empty');
    assert.equal(fallback.status, 200);
    assert.equal(fallback.headers.get('cache-control'), 'public, max-age=86400');
    assert.equal((await sharp(Buffer.from(await fallback.arrayBuffer())).metadata()).width, 1200);
    assert.equal((await get('missing')).status, 404);
    assert.equal((await get('../invalid')).status, 404);
    await Promise.all(pending);
  } finally {
    global.fetch = originalFetch; global.caches = originalCaches; global[symbol] = originalContext;
  }
});
