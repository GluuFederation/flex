import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import i18n from '@/i18n'
import ShortcodePopover from '../ShortcodePopover'
import type { ShortcodePopoverProps } from '../types'

const codes: ShortcodePopoverProps['codes'] = [
  { key: '{{user}}', label: 'User' },
  { key: '{{org}}', label: 'Organization' },
]

const setup = (overrides: Partial<ShortcodePopoverProps> = {}) => {
  const handleSelectShortcode = jest.fn()
  const props: ShortcodePopoverProps = { codes, handleSelectShortcode, ...overrides }
  render(<ShortcodePopover {...props} />, { wrapper: AppTestWrapper })
  return { handleSelectShortcode }
}

// Before opening, the only button on screen is the popover trigger.
const getTrigger = () => screen.getAllByRole('button')[0]

describe('ShortcodePopover', () => {
  it('keeps the popover closed until the trigger is clicked', () => {
    setup()
    expect(screen.queryByText('User')).not.toBeInTheDocument()
  })

  it('opens the popover and lists the shortcode labels on click', () => {
    setup()
    fireEvent.click(getTrigger())
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Organization')).toBeInTheDocument()
  })

  it('emits the selected shortcode key and closes the popover', () => {
    const { handleSelectShortcode } = setup()
    fireEvent.click(getTrigger())
    fireEvent.click(screen.getByText('Organization'))
    expect(handleSelectShortcode).toHaveBeenCalledWith('{{org}}')
  })

  it('does not open or emit when disabled', () => {
    const { handleSelectShortcode } = setup({ disabled: true })
    fireEvent.click(getTrigger())
    expect(screen.queryByText('User')).not.toBeInTheDocument()
    expect(handleSelectShortcode).not.toHaveBeenCalled()
  })

  it('shows the empty message when there are no codes', () => {
    setup({ codes: [] })
    fireEvent.click(getTrigger())
    expect(screen.getByText(i18n.t('messages.no_shortcodes_found'))).toBeInTheDocument()
  })
})
