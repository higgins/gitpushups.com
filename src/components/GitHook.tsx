'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { ClipboardCopy, Check } from "lucide-react"

interface GitHookProps {
  /** Optional username to embed in the curl URL */
  username?: string
}

export function GitHook({ username }: GitHookProps) {
  const [copied, setCopied] = useState(false)
  const url = username ? `https://gitpushups.com/@${username}` : 'https://gitpushups.com/@GH_USERNAME'

  const CODE = String.raw`d=$(date +%F)
res=$(curl -fs ${url}?d=$d)

if [ "$res" != "true" ]; then
  echo "\033[0;31m✗ Do your pushups first!\033[0m" >&2
  exit 1
else
  echo "\033[0;32m✓ Pushups verified!\033[0m"
fi`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="mt-2 mb-4 relative p-4 bg-black text-[#fdf6ed] font-thin">
      <ScrollArea className="max-h-64">
        <pre className="text-sm font-mono whitespace-pre-wrap">{CODE}</pre>
      </ScrollArea>

      <Button
        onClick={handleCopy}
        size="icon"
        className="absolute top-2 right-2 z-20 flex cursor-pointer [&_svg]:pointer-events-none"
      >
        {copied
          ? <Check className="h-4 w-4 text-green-500" />
          : <ClipboardCopy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </Card>
  )
}
