import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import TooltipDesign from '../TooltipDesign'
import type { TooltipDesignProps } from '../../types'

const renderTooltip = (props: TooltipDesignProps) =>
  render(
    <I18nextProvider i18n={i18n}>
      <TooltipDesign {...props} />
    </I18nextProvider>,
  )

describe('TooltipDesign', () => {
  it('renders nothing when not active', () => {
    const { container } = renderTooltip({
      active: false,
      payload: [{ dataKey: 'mau', value: 5 }],
    })
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the payload is empty', () => {
    const { container } = renderTooltip({ active: true, payload: [] })
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the mapped "mau" label alongside its value when active', () => {
    renderTooltip({
      active: true,
      payload: [{ dataKey: 'mau', value: 42 }],
    })
    // Assert the translated label from the labelMap, not just the value, so a
    // regression in the mau -> monthly_active_users mapping is caught.
    const label = i18n.t('fields.monthly_active_users')
    expect(screen.getByText(`${label}: 42`)).toBeInTheDocument()
  })

  it('falls back to the payload name when the dataKey is unmapped', () => {
    renderTooltip({
      active: true,
      payload: [{ dataKey: 'unknown_key', name: 'Custom Series', value: 7 }],
    })
    expect(screen.getByText(/Custom Series: 7/)).toBeInTheDocument()
  })

  it('prefers the per-row payload value over the item value', () => {
    renderTooltip({
      active: true,
      payload: [{ dataKey: 'mau', value: 1, payload: { mau: 99 } }],
    })
    expect(screen.getByText(/99/)).toBeInTheDocument()
  })

  it('uses a custom formatter when provided', () => {
    renderTooltip({
      active: true,
      payload: [{ dataKey: 'mau', value: 10 }],
      formatter: (v) => `formatted-${String(v)}`,
    })
    expect(screen.getByText(/formatted-10/)).toBeInTheDocument()
  })

  it('renders one row per payload item', () => {
    renderTooltip({
      active: true,
      payload: [
        { dataKey: 'mau', value: 1 },
        { dataKey: 'clientCredentials', value: 2 },
      ],
    })
    expect(screen.getByText(/: 1$/)).toBeInTheDocument()
    expect(screen.getByText(/: 2$/)).toBeInTheDocument()
  })

  it('applies the provided background and text colors', () => {
    const { container } = renderTooltip({
      active: true,
      backgroundColor: 'rgb(1, 2, 3)',
      textColor: 'rgb(4, 5, 6)',
      payload: [{ dataKey: 'mau', value: 1 }],
    })
    const card = container.querySelector('.thumbnail') as HTMLElement
    expect(card.style.backgroundColor).toBe('rgb(1, 2, 3)')
    expect(card.style.color).toBe('rgb(4, 5, 6)')
  })
})
