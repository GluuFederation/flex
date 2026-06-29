import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import JsonPropertyBuilder from '../JsonPropertyBuilder'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const renderBuilder = (props: Partial<React.ComponentProps<typeof JsonPropertyBuilder>> = {}) =>
  render(
    <JsonPropertyBuilder
      propKey="myField"
      propValue="hello"
      lSize={4}
      handler={jest.fn()}
      {...props}
    />,
    { wrapper: AppTestWrapper },
  )

describe('JsonPropertyBuilder', () => {
  it('renders a text input for a string property with its current value', () => {
    renderBuilder()
    const input = screen.getByDisplayValue('hello')
    expect(input).toBeInTheDocument()
  })

  it('emits a replace patch at the property path on change', () => {
    const handler = jest.fn()
    renderBuilder({ handler })
    fireEvent.change(screen.getByDisplayValue('hello'), { target: { value: 'world' } })
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ op: 'replace', path: '/myField', value: 'world' }),
    )
  })
})
