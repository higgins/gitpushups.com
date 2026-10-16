import { redirect } from 'next/navigation'

export default function AccountPage() {
  redirect('/?welcome=1')
}
