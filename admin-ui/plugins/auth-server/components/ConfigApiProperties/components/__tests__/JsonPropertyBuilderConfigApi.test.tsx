import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import JsonPropertyBuilderConfigApi from '../JsonPropertyBuilderConfigApi'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const renderBuilder = (
  props: Partial<React.ComponentProps<typeof JsonPropertyBuilderConfigApi>> = {},
) =>
  render(
    <JsonPropertyBuilderConfigApi
      propKey="myField"
      propValue="hello"
      lSize={4}
      handler={jest.fn()}
      {...props}
    />,
    { wrapper: AppTestWrapper },
  )

describe('JsonPropertyBuilderConfigApi', () => {
  it('renders a text input for a string property with its current value', () => {
    renderBuilder()
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('emits a replace patch at the property path on change', () => {
    const handler = jest.fn()
    renderBuilder({ handler })
    fireEvent.change(screen.getByDisplayValue('hello'), { target: { value: 'world' } })
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ op: 'replace', path: '/myField', value: 'world' }),
    )
  })

  it('renders the input as disabled when the disabled prop is set', () => {
    renderBuilder({ disabled: true })
    expect(screen.getByDisplayValue('hello')).toBeDisabled()
  })
})
