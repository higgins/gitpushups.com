import { GitHookCode } from './landing/InstallationSection'

/** Shared with profile pages so installed checks use the same generator. */
export function GitHook({ username }: { username?: string }) {
  return <GitHookCode username={username} />
}
