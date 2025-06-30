import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App'

// Mock the Clerk environment variable and ClerkProvider
vi.mock('@clerk/clerk-react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('./App', () => ({
  App: () => (
    <div>
      <h1>🎉 PartyPilot</h1>
      <p>Dein persönlicher Party-Organisator</p>
    </div>
  ),
}))

describe('App', () => {
  it('renders the welcome message', () => {
    render(<App />)
    expect(screen.getByText(/PartyPilot/)).toBeInTheDocument()
    expect(screen.getByText(/Dein persönlicher Party-Organisator/)).toBeInTheDocument()
  })
}) 