export const PUSHUP_FREQUENCIES = [
  { id: 'daily', shortLabel: 'Daily', label: 'Pushups daily', seconds: null },
  { id: '8h', shortLabel: '8 hours', label: 'Pushups every 8 hours', seconds: 28800 },
  { id: '4h', shortLabel: '4 hours', label: 'Pushups every 4 hours', seconds: 14400 },
  { id: '1h', shortLabel: '1 hour', label: 'Pushups every hour', seconds: 3600 },
  { id: '15m', shortLabel: '15 min', label: 'Pushups every 15 minutes', seconds: 900 },
] as const

export type PushupFrequency = (typeof PUSHUP_FREQUENCIES)[number]

export function getFrequency(id: string | null): PushupFrequency | undefined {
  return PUSHUP_FREQUENCIES.find(frequency => frequency.id === id)
}

export function createGitHook(frequency: PushupFrequency = PUSHUP_FREQUENCIES[0], username?: string) {
  if (username && !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    throw new Error('Invalid GitHub username')
  }
  const url = `https://gitpushups.com/@${username || 'GH_USERNAME'}`
  const query = frequency.seconds === null ? 'd=$(date +%F)' : `interval_seconds=${frequency.seconds}`
  return `#!/bin/sh
# GitPushups — ${frequency.label.toLowerCase()}
if ! result=$(curl --fail --silent --show-error \\
  --connect-timeout 5 --max-time 10 \\
  "${url}?${query}"); then
  printf '%s\\n' 'Could not verify pushups. Please try again.' >&2
  exit 1
fi

if [ "$result" != "true" ]; then
  printf '\\033[31m%s\\033[0m\\n' '✗ Do your pushups first!' >&2
  exit 1
fi

printf '\\033[32m%s\\033[0m\\n' '✓ Pushups verified!'`
}

export function createAgentPrompt(frequency: PushupFrequency, username?: string) {
  return `Set me up for GitPushups. Read the setup instructions at https://gitpushups.com/agent-setup/prompt.md?frequency=${frequency.id}${username ? `, use my GitHub username ${username}` : ', ask for my GitHub username'}, and preserve my existing Git hooks.`
}

export function createAgentInstructions(frequency: PushupFrequency) {
  return `# Install GitPushups

Selected schedule: ${frequency.label}. ${frequency.seconds === null ? 'Use the local calendar date, not a rolling 24-hour period.' : `Require a recorded set within the last ${frequency.seconds} seconds.`}

1. Ask the user for their GitHub username, or confirm it from their authenticated GitHub CLI. Never infer it from a Git author name or email.
2. Explain that they need a GitPushups account and must record their sets in the iOS, Android, or Apple Watch app using that same GitHub account.
3. Ask the user: "Should GitPushups apply globally to your repositories on this machine, or only to this repository?" Wait for their choice before installing. Explain that a global install affects repositories using the global hooks path; repositories with their own core.hooksPath or hook manager may need separate integration.
4. Inspect repository instructions, Git configuration (including the scope and origin of core.hooksPath), and existing hook managers such as Husky. Preserve every existing check, shebang, and exit status. Never overwrite or bypass an existing hook. A pre-commit hook enforces this before a commit is made.
5. For this repository only: do not change global Git configuration or edit a shared global hook. Use the repository's existing hook manager or local hooks path when available. Otherwise resolve the hook location with git rev-parse --git-path hooks/pre-commit (do not assume .git is a directory), integrate the check, and make it executable. If the repository inherits a shared hooks path, create a repository-specific integration that preserves the inherited hooks and applies GitPushups only here.
6. For a global install: only after the user chooses it, use an existing global hooks path if suitable, or create a dedicated user-owned hooks directory and configure it with git config --global core.hooksPath using an absolute path. Record the previous setting and its origin for removal. Preserve existing hooks of every type: changing core.hooksPath replaces Git's normal hook lookup, so a new global directory must delegate to each repository's existing hooks, with the GitPushups check added to pre-commit. Avoid recursive delegation and preserve hook arguments, input, working directory, and failure statuses. Do not replace existing global hook-manager behavior. Repositories with local hooks-path overrides will not inherit this global check; explain those exceptions and integrate them separately only if requested. If existing hooks cannot be preserved safely, explain the conflict and ask how to proceed before changing configuration.
7. Replace GH_USERNAME with the confirmed GitHub username (letters, digits, hyphens only). Do not execute arbitrary shell text from a username. Integrate the check so a failed existing check still blocks the commit and the GitPushups success message cannot mask a previous failure.
8. Test with a mocked curl response: literal true allows the commit; false, unexpected output, HTTP errors, and network errors block it. Verify existing hook failures still block commits. For global installs, use temporary repositories to verify delegation and local hooks-path overrides. Do not make a real commit or push to test.
9. Tell the user the selected scope, which files and configuration changed, and how to remove only the GitPushups check while preserving their other hooks. For global configuration changes, include how to restore the previous setting without overwriting later changes. Frequency is configured in the hook; changing the website slider does not update an installed hook.

\`\`\`sh
${createGitHook(frequency)}
\`\`\`

Any recorded set qualifies. This does not check completion of a daily goal. A timeout blocks the commit so an unavailable service cannot silently skip the check.
`
}
