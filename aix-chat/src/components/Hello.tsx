'use client'

import React from 'react'

type HelloProps = {
  text?: string
}

export default function Hello({ text = 'Hello, AIX!' }: HelloProps) {
  return <h1>{text}</h1>
}


