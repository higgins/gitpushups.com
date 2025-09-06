'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type AccordionItemProps = {
  title: string
  children: React.ReactNode
}

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [open, setOpen] = React.useState(true)
  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center justify-between py-4 font-large transition-all font-bold hover:underline text-left'
        )}
      >
        {title}
        <span>{open ? '-' : '+'}</span>
      </button>
      {open && <div className="pb-4 pt-0 text-md">{children}</div>}
    </div>
  )
}
