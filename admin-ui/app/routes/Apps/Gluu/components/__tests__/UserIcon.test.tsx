import { render, screen, fireEvent } from '@testing-library/react'
import { UserIcon } from 'Routes/Apps/Gluu/components/UserIcon'

describe('UserIcon', () => {
  it('renders the avatar image with alt text', () => {
    render(<UserIcon />)
    expect(screen.getByAltText('User avatar')).toBeInTheDocument()
  })

  it('uses the provided avatar url', () => {
    render(<UserIcon avatarUrl="https://example.com/me.png" />)
    const img = screen.getByAltText('User avatar') as HTMLImageElement
    expect(img.src).toContain('https://example.com/me.png')
  })

  it('falls back to the default avatar when avatarUrl is null', () => {
    render(<UserIcon avatarUrl={null} />)
    const img = screen.getByAltText('User avatar') as HTMLImageElement
    expect(img.getAttribute('src')).toBeTruthy()
  })

  it('swaps to the default avatar on image load error', () => {
    render(<UserIcon avatarUrl="https://broken.example/x.png" />)
    const img = screen.getByAltText('User avatar') as HTMLImageElement
    const before = img.src
    fireEvent.error(img)
    expect(img.src).not.toBe(before)
  })

  it('applies a custom className to the container', () => {
    const { container } = render(<UserIcon className="my-avatar" />)
    expect(container.querySelector('.my-avatar')).toBeInTheDocument()
  })
})
