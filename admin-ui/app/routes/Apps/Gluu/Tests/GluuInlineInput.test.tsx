import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GluuInlineInput from '../GluuInlineInput'
import AppTestWrapper from './Components/AppTestWrapper'

const LABEL = 'fields.application_type'
const NAME = 'application_type'
let VALUE: boolean | string | string[] = true

const handler = jest.fn()

it('Should render a boolean select box', () => {
  const { container } = render(
    <AppTestWrapper>
      <GluuInlineInput label={LABEL} value={VALUE} name={NAME} isBoolean handler={handler} />
    </AppTestWrapper>,
  )
  const inputEl = container.querySelector<HTMLInputElement>(`input[name=${NAME}]`)
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()
  expect(inputEl).toBeTruthy()
  expect(inputEl!.checked).toBe(true)
  fireEvent.click(inputEl!)
  expect(inputEl!.checked).toBe(false)
})

it('Should render a typeahead component with array', () => {
  const arrayValue = ['Two']
  const options = ['One', 'Two', 'Three']
  render(
    <AppTestWrapper>
      <GluuInlineInput
        label={LABEL}
        value={arrayValue}
        name={NAME}
        options={options}
        isArray
        handler={handler}
      />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()
  fireEvent.click(screen.getByText(arrayValue[0]))
})

it('Should render a text input', () => {
  VALUE = 'Client Secret'
  render(
    <AppTestWrapper>
      <GluuInlineInput label={LABEL} value={VALUE} name={NAME} handler={handler} />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()
  expect(screen.getByDisplayValue(VALUE as string).id).toBe(NAME)
})
