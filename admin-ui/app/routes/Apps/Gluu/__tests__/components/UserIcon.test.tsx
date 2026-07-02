import { render, screen, fireEvent } from '@testing-library/react'
import { UserIcon } from 'Routes/Apps/Gluu/components/UserIcon'
// Same default-avatar module the component imports, so the test asserts the
// exact shared fallback value rather than "any non-empty src".
import DEFAULT_AVATAR_URL from '@/images/avatars/ava1.png'

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
    expect(img.getAttribute('src')).toBe(DEFAULT_AVATAR_URL)
  })

  it('swaps to the default avatar on image load error', () => {
    render(<UserIcon avatarUrl="https://broken.example/x.png" />)
    const img = screen.getByAltText('User avatar') as HTMLImageElement
    expect(img.getAttribute('src')).toBe('https://broken.example/x.png')
    fireEvent.error(img)
    expect(img.getAttribute('src')).toBe(DEFAULT_AVATAR_URL)
  })

  it('applies a custom className to the container', () => {
    const { container } = render(<UserIcon className="my-avatar" />)
    expect(container.querySelector('.my-avatar')).toBeInTheDocument()
  })
})
