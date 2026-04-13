import React from 'react'
import { fireEvent, screen } from '@testing-library/dom'
import GluuToogle from '../GluuToogle'
import { render } from '@testing-library/react'

describe('Toggle switch', () => {
  it('should update the state and UI when toggled', () => {
    const initialChecked = true
    const name = 'switch'
    const handlerMock = jest.fn()

    render(<GluuToogle name={name} value={initialChecked} handler={handlerMock} />)

    const toggleElement = screen.getByTestId(name) as HTMLInputElement
    expect(toggleElement.checked).toBe(initialChecked)

    fireEvent.click(toggleElement)
    expect(handlerMock).toHaveBeenCalledTimes(1)
    expect(toggleElement.checked).toBe(!initialChecked)
  })
})
