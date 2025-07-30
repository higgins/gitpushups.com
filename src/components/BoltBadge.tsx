import React from 'react'

export function BoltBadge() {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 rounded px-3 py-1 text-xs text-white hover:bg-opacity-100"
    >
      <img className="h-[80px] hover:h-[90px]" src="/bolt.png" />
    </a>
  )
}
