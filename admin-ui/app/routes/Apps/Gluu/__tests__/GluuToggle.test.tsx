import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { fireEvent, screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import GluuToggle from '../GluuToggle'

const NAME = 'switch'

const ControlledToggle = ({ onToggle }: { onToggle: (checked: boolean) => void }) => {
  const [value, setValue] = useState(true)
  return (
    <GluuToggle
      name={NAME}
      value={value}
      handler={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.checked)
        onToggle(event.target.checked)
      }}
    />
  )
}

describe('Toggle switch', () => {
  it('should update the state and UI when toggled', () => {
    const handlerMock = jest.fn()
    render(<ControlledToggle onToggle={handlerMock} />)

    const toggleElement = screen.getByTestId(NAME) as HTMLInputElement
    expect(toggleElement.checked).toBe(true)

    fireEvent.click(toggleElement)
    expect(handlerMock).toHaveBeenCalledTimes(1)
    expect(toggleElement.checked).toBe(false)
  })
})
