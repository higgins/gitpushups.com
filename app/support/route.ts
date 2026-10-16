import { NextResponse } from 'next/server'
import { SUPPORT_PAYMENT_URL } from '@/lib/support'

export function GET() {
  return NextResponse.redirect(SUPPORT_PAYMENT_URL, 308)
}
