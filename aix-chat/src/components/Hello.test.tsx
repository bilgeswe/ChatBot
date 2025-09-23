import React from 'react'
import { render, screen } from '@testing-library/react'
import Hello from './Hello'

it('renders the hello text by default', () => {
  render(<Hello />)
  expect(screen.getByRole('heading', { level: 1, name: /hello, aix!/i })).toBeInTheDocument()
})

it('renders custom text when provided', () => {
  render(<Hello text="Howdy" />)
  expect(screen.getByRole('heading', { level: 1, name: /howdy/i })).toBeInTheDocument()
})


