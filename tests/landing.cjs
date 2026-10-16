const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const { mkdtempSync, writeFileSync, rmSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');
const dir = mkdtempSync(join(process.cwd(), '.landing-tests-'));
after(() => rmSync(dir, { recursive: true, force: true }));
buildSync({ entryPoints: ['src/lib/installation.ts'], outfile: join(dir, 'installation.cjs'), bundle: true, platform: 'node', format: 'cjs' });
const { createGitHook, createAgentPrompt, createAgentInstructions, PUSHUP_FREQUENCIES } = require(join(dir, 'installation.cjs'));

test('all schedules generate executable hooks that allow only a successful literal true response', () => {
  writeFileSync(join(dir, 'curl'), '#!/bin/sh\nprintf "%s" "$MOCK_REPLY"\nprintf "%s\\n" "$@" > "$MOCK_ARGS"\nexit "$MOCK_EXIT"\n', { mode: 0o755 });
  for (const frequency of PUSHUP_FREQUENCIES) {
    const code = createGitHook(frequency, 'octo-cat');
    const file = join(dir, 'pre-commit');
    writeFileSync(file, code);
    assert.equal(spawnSync('/bin/sh', ['-n', file]).status, 0);
    for (const [reply, exit, expected] of [['true', 0, 0], ['false', 0, 1], ['true', 22, 1], ['true', 28, 1], ['', 0, 1], ['{"allowed":true}', 0, 1]]) {
      const result = spawnSync('/bin/sh', [file], { env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, MOCK_REPLY: reply, MOCK_EXIT: String(exit), MOCK_ARGS: join(dir, 'args') }, encoding: 'utf8' });
      assert.equal(result.status, expected, `${frequency.id}: ${reply}/${exit}`);
    }
    const args = readFileSync(join(dir, 'args'), 'utf8');
    if (frequency.seconds === null) assert.match(args, /@octo-cat\?d=\d{4}-\d{2}-\d{2}/);
    else assert.ok(args.includes(`@octo-cat?interval_seconds=${frequency.seconds}`));
    assert.ok(createAgentPrompt(frequency).includes(`frequency=${frequency.id}`));
    assert.ok(createAgentInstructions(frequency).includes(createGitHook(frequency)));
  }
});

test('shell interpolation in usernames is rejected', () => {
  for (const username of ['$(touch /tmp/no)', 'name;exit 0', 'a"b', '-bad', 'bad-', 'a/b']) {
    assert.throws(() => createGitHook(PUSHUP_FREQUENCIES[0], username), /Invalid GitHub username/);
  }
});
