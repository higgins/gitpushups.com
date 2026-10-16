'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { setStatus('idle'); clearTimeout(timer.current) }, [text])
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setStatus('idle'), 2500)
    } catch { setStatus('error') }
  }
  return <span className="copy-control">
    <button type="button" className="icon-button" onClick={copy} aria-label={label} title={label}>
      {status === 'copied' ? <Check size={18} /> : <Copy size={18} />}
    </button>
    <span className={status === 'error' ? 'copy-error' : 'sr-only'} role="status">
      {status === 'copied' ? 'Copied to clipboard.' : status === 'error' ? 'Copy unavailable. Select and copy the text.' : ''}
    </span>
  </span>
}
