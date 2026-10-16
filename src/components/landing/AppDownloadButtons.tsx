import { AppStoreBadge } from '@/components/AppStore'
import { PlayStoreBadge } from '@/components/PlayStore'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-stores'

export function AppDownloadButtons() {
  return <div className="app-download-buttons" aria-label="Download GitPushups">
    <AppStoreBadge appStoreUrl={APP_STORE_URL} />
    <PlayStoreBadge appStoreUrl={PLAY_STORE_URL} />
  </div>
}
