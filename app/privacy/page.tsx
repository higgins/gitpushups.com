export const metadata = {
  title: 'Privacy - GitPushups',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-4 prose">
      <h1 className="mb-1">Privacy Policy</h1>
      <h3 className="mt-0">(Last updated: July 21, 2025)</h3>

      <p>MeMeTiMe LLC ("Company") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and safeguard your information when you use the GitPushups app.</p>

      <h2>1. Information Collection</h2>
      <ul>
        <li>
          <strong>Account Information:</strong> When you sign in using GitHub, we access your public profile information (such as name and username) and your verified email address. This information is used solely to identify your account and is not used for advertising or shared with third parties.
        </li>
        <li>
          <strong>Usage Data:</strong> We collect anonymized, aggregate usage data to improve product performance and detect errors. This data may be processed by trusted third-party analytics providers.
        </li>
        <li id="true-depth">
          <strong>Camera and TrueDepth API:</strong> GitPushups uses the device's front-facing camera, including the Apple TrueDepth API, to detect your proximity to the device for the purpose of counting pushups. The facial depth data is processed in real time on your device to track body movement and calculate rep counts.
        </li>
      </ul>

      <h2>2. Use of Face Data</h2>
      <p>
        GitPushups accesses TrueDepth API data to measure proximity-based motion as part of its core fitness tracking functionality. The app does <strong>not</strong> use this data to personally identify users, perform authentication, or derive facial features. Specifically:
      </p>
      <ul>
        <li>The data is processed locally on your device and is never transmitted to our servers.</li>
        <li>The data is <strong>not stored</strong>, recorded, or retained beyond each session.</li>
        <li>The data is <strong>not shared</strong> with any third parties.</li>
        <li>The data is <strong>not used</strong> for advertising, marketing, or analytics.</li>
      </ul>
      <p>You may revoke camera and TrueDepth access at any time by adjusting your device settings.</p>

      <h2>3. Data Security</h2>
      <p>We implement industry-standard security practices to protect data, including encryption in transit and routine audits. However, no digital service can guarantee absolute security.</p>

      <h2>4. Liability</h2>
      <p>Use of GitPushups is at your own risk. MeMeTiMe LLC assumes no liability for damages arising from data access, breach, or misuse.</p>

      <h2>5. Consent</h2>
      <p>By continuing to use GitPushups, you consent to the collection and processing of data as described in this policy.</p>
    </main>
  )
}
