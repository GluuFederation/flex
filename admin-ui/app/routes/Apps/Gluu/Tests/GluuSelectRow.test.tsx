import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import GluuSelectRow from '../GluuSelectRow'
import AppTestWrapper from './Components/AppTestWrapper.test'

const label = 'Select Option:'
const name = 'selectName'
const value = 'option2'
const values = ['option1', 'option2', 'option3']

describe('GluuSelectRow', () => {
  const formikHandleChangeMock = jest.fn()
  const formikMock = {
    handleChange: formikHandleChangeMock,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders select with the correct initial value', () => {
    render(
      <AppTestWrapper>
        <GluuSelectRow
          label={label}
          name={name}
          value={value}
          values={values}
          formik={formikMock}
        />
      </AppTestWrapper>,
    )

    expect(screen.getByText(value)).toBeInTheDocument()
  })

  test('renders select and opens dropdown with all options', () => {
    render(
      <AppTestWrapper>
        <GluuSelectRow
          label={label}
          name={name}
          value={value}
          values={values}
          formik={formikMock}
        />
      </AppTestWrapper>,
    )

    const selectTrigger = screen.getByRole('combobox')
    fireEvent.mouseDown(selectTrigger)

    const listbox = within(screen.getByRole('listbox'))
    values.forEach((optionValue) => {
      expect(listbox.getByText(optionValue)).toBeInTheDocument()
    })
  })

  test('calls formik handleChange when selecting a new option', () => {
    render(
      <AppTestWrapper>
        <GluuSelectRow
          label={label}
          name={name}
          value={value}
          values={values}
          formik={formikMock}
        />
      </AppTestWrapper>,
    )

    const selectTrigger = screen.getByRole('combobox')
    fireEvent.mouseDown(selectTrigger)

    const newValue = 'option3'
    const listbox = within(screen.getByRole('listbox'))
    fireEvent.click(listbox.getByText(newValue))

    expect(formikHandleChangeMock).toHaveBeenCalledTimes(1)
  })

  test('calls custom handleChange when provided', () => {
    const handleChangeMock = jest.fn()

    render(
      <AppTestWrapper>
        <GluuSelectRow
          label={label}
          name={name}
          value={value}
          values={values}
          formik={formikMock}
          handleChange={handleChangeMock}
        />
      </AppTestWrapper>,
    )

    const selectTrigger = screen.getByRole('combobox')
    fireEvent.mouseDown(selectTrigger)

    const newValue = 'option1'
    const listbox = within(screen.getByRole('listbox'))
    fireEvent.click(listbox.getByText(newValue))

    expect(formikHandleChangeMock).toHaveBeenCalledTimes(1)
    expect(handleChangeMock).toHaveBeenCalledTimes(1)
  })
})
