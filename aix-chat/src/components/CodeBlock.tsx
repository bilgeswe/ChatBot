'use client'

import React from 'react'

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean
}

export default function CodeBlock({ inline, className, children, ...props }: CodeProps) {
  const isBlock = !inline && typeof className === 'string' && className.includes('language-')
  const codeText = String(children ?? '')

  if (!isBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(codeText)
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 top-2 z-10 rounded bg-black/80 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-white/80 dark:text-black"
        aria-label="Copy code"
      >
        Copy
      </button>
      <pre className={className?.replace('language-', 'hljs language-')} {...props}>
        <code>{codeText}</code>
      </pre>
    </div>
  )
}


