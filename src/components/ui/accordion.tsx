'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

type AccordionItemProps = {
  title: string
  children: React.ReactNode
  id?: string
}

export function AccordionItem({ title, children, id }: AccordionItemProps) {
  const [open, setOpen] = React.useState(true)
  return (
    <div id={id} className="border-b">
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
