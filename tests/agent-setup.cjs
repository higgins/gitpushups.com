const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const { mkdtempSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const dir = mkdtempSync(join(process.cwd(), '.agent-setup-tests-'));
after(() => rmSync(dir, { recursive: true, force: true }));
buildSync({ entryPoints: ['app/agent-setup/prompt.md/route.ts'], outfile: join(dir, 'route.cjs'), bundle: true, platform: 'node', format: 'cjs' });
const { GET } = require(join(dir, 'route.cjs'));
test('Markdown instructions match all five slider schedules', async () => {
  for (const [id, query] of [['daily', 'd=$(date +%F)'], ['8h', 'interval_seconds=28800'], ['4h', 'interval_seconds=14400'], ['1h', 'interval_seconds=3600'], ['15m', 'interval_seconds=900']]) {
    const response = GET(new Request(`https://gitpushups.com/agent-setup/prompt.md?frequency=${id}`));
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/markdown/);
    const body = await response.text();
    assert.ok(body.includes(query));
    assert.ok(body.includes('Preserve every existing check'));
  }
});
test('missing frequency defaults to daily; invalid and duplicate values are rejected', async () => {
  const daily = GET(new Request('https://gitpushups.com/agent-setup/prompt.md'));
  assert.equal(daily.status, 200);
  assert.ok((await daily.text()).includes('d=$(date +%F)'));
  for (const query of ['frequency=2h', 'frequency=', 'frequency=unknown', 'frequency=daily&frequency=1h']) {
    assert.equal(GET(new Request(`https://gitpushups.com/agent-setup/prompt.md?${query}`)).status, 400);
  }
});
