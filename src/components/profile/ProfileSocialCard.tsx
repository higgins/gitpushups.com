import React from 'react'
import type { ProfileCardData } from '@/lib/profile-social'

// Advance widths from the bundled Barlow Condensed Bold font (1,000 units/em).
// Fit each complete line without wrapping or truncating usernames and totals.
const glyphWidths: Record<string, number> = {
  A: 482, B: 470, C: 464, D: 476, E: 438, F: 421, G: 467, H: 480, I: 230, J: 452, K: 491, L: 426, M: 548, N: 514, O: 473, P: 465, Q: 461, R: 471, S: 444, T: 468, U: 479, V: 488, W: 689, X: 475, Y: 474, Z: 412,
  a: 446, b: 445, c: 434, d: 445, e: 436, f: 298, g: 441, h: 447, i: 219, j: 217, k: 449, l: 209, m: 675, n: 447, o: 442, p: 448, q: 448, r: 324, s: 412, t: 291, u: 447, v: 436, w: 613, x: 439, y: 423, z: 373,
  '0': 453, '1': 284, '2': 438, '3': 436, '4': 484, '5': 439, '6': 440, '7': 407, '8': 440, '9': 435, '-': 331, '@': 759, ' ': 200, ',': 211,
}

function lineFontSize(text: string, maximum: number) {
  const width = [...text].reduce((sum, character) => sum + (glyphWidths[character] ?? 700), 0)
  return Math.min(maximum, Math.floor(560_000 / width))
}

// The template's contribution grid is decorative; only the annual total is user data.
export function ProfileSocialCard({ data, template, avatar, logo }: { data: ProfileCardData; template: string; avatar: string | null; logo: string }) {
  const username = `@${data.username}`
  const pushups = data.total === null ? 'Pushups unavailable' : `${data.total.toLocaleString('en-US')} pushups`
  const year = `in ${data.year}`
  return <div style={{ display: 'flex', position: 'relative', width: 1200, height: 630, background: '#fdf6ed', color: '#24211f', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>
    <img src={template} width={1200} height={630} alt="" style={{ position: 'absolute', left: 0, top: 0 }} />
    <div style={{ display: 'flex', position: 'absolute', left: 32, top: 24, width: 600, height: 582, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center' }}>
      <div style={{ display: 'flex', width: 116, height: 116, flexShrink: 0, borderRadius: 58, border: '4px solid #f55b43', overflow: 'hidden', background: '#f55b43', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
        {avatar ? <img src={avatar} width={108} height={108} alt="" style={{ objectFit: 'cover', borderRadius: 54 }} /> : data.username[0].toUpperCase()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: lineFontSize(username, 92), lineHeight: 1.05, whiteSpace: 'nowrap' }}>{username}</div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: lineFontSize(pushups, 100), lineHeight: 1.05, whiteSpace: 'nowrap', color: '#e84d35' }}>{pushups}</div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: lineFontSize(year, 72), lineHeight: 1.05, whiteSpace: 'nowrap' }}>{year}</div>
      <img src={logo} width={148} height={115} alt="" style={{ objectFit: 'contain', flexShrink: 0 }} />
    </div>
  </div>
}
