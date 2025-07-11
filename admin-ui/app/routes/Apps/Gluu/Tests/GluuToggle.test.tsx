import React from 'react'
import { fireEvent, screen } from '@testing-library/dom'
import GluuToogle from '../GluuToogle'
import { render } from '@testing-library/react'

describe('Toggle switch', () => {
  it('should update the state and UI when toggled', () => {
    // Set up initial values
    const initialChecked = true
    const name = 'switch'
    const handlerMock = jest.fn() // Create a mock function for the handler

    // Render the component with initial props and state
    render(<GluuToogle name={name} value={initialChecked} handler={handlerMock} />)

    // Find the Toggle component in the DOM
    const toggleElement: any = screen.getByTestId(name)

    // Assert that the Toggle is initially checked
    expect(toggleElement.checked).toBe(initialChecked)

    // Simulate a click on the Toggle
    fireEvent.click(toggleElement)

    // Assert that the handler function was called
    expect(handlerMock).toHaveBeenCalledTimes(1)

    // Assert that the state has been updated correctly after the click
    expect(toggleElement.checked).toBe(!initialChecked)
  })
})
