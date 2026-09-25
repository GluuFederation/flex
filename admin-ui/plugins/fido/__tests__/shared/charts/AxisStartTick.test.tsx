import React from 'react'
import { render } from '@testing-library/react'
import { AxisStartTick, type AxisStartTickProps } from 'Plugins/fido/shared/charts'

const renderTick = (props: AxisStartTickProps) =>
  render(
    <svg>
      <AxisStartTick {...props} />
    </svg>,
  ).container.querySelector('text')

describe('AxisStartTick', () => {
  it('draws the label at the canvas edge so it lines up with the card title', () => {
    const tick = renderTick({ y: 120, payload: { value: 100 }, fill: '#fff', fontSize: 10 })

    expect(tick).not.toBeNull()
    expect(tick?.getAttribute('x')).toBe('0')
    expect(tick?.getAttribute('y')).toBe('120')
    expect(tick?.getAttribute('text-anchor')).toBe('start')
    expect(tick?.getAttribute('dy')).toBe('0.355em')
    expect(tick?.textContent).toBe('100')
  })

  it('starts every label at the same x whatever its width', () => {
    const wide = renderTick({ y: 10, payload: { value: 100 } })
    const narrow = renderTick({ y: 40, payload: { value: 0 } })

    expect(wide?.getAttribute('x')).toBe(narrow?.getAttribute('x'))
  })

  it('applies the axis formatter, which recharts does not do for a custom tick', () => {
    const tick = renderTick({
      y: 10,
      payload: { value: 'a-very-long-account-name' },
      tickFormatter: (value: never) => `${String(value).slice(0, 8)}…`,
      index: 2,
    })

    expect(tick?.textContent).toBe('a-very-l…')
  })
})
