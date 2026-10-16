const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { buildSync } = require('esbuild');
const { mkdtempSync, rmSync } = require('node:fs');
const { join } = require('node:path');
const dir = mkdtempSync(join(process.cwd(), '.contribution-tests-'));
after(() => rmSync(dir, { recursive: true, force: true }));
buildSync({ entryPoints: ['src/lib/contributions.ts'], outfile: join(dir, 'contributions.cjs'), bundle: true, platform: 'node', format: 'cjs' });
const { contributionCalendar, contributionLevel } = require(join(dir, 'contributions.cjs'));

test('calendar preserves local-date keys across leap days and year boundaries', () => {
  const days = contributionCalendar(2024, { '2024-02-29': { reps: 45, goal: 40 }, '2023-12-31': { reps: 100, goal: 40 } });
  assert.equal(days.length, 366);
  assert.equal(days[0].date, '2024-01-01');
  assert.equal(days[0].weekday, 1);
  assert.equal(days.at(-1).date, '2024-12-31');
  assert.equal(days.reduce((total, day) => total + day.reps, 0), 45);
  assert.equal(days.find(day => day.date === '2024-02-29').weekday, 4);
  assert.equal(days.filter(day => day.monthStart).length, 12);
  assert.equal(contributionCalendar(2026, {}).length, 365);
  const longYear = contributionCalendar(2000, {});
  assert.equal(longYear.at(-1).week, 53);
});

test('color intensity follows the app’s goal thresholds, including unset goals', () => {
  assert.deepEqual([0, 1, 20, 30, 40, 60].map(reps => contributionLevel({ reps, goal: 40 })), [0, 1, 2, 3, 4, 4]);
  assert.equal(contributionLevel({ reps: 0, goal: 0 }), 0);
  assert.equal(contributionLevel({ reps: 1, goal: 0 }), 4);
});
