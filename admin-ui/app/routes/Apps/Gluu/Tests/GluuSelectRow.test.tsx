import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import GluuSelectRow from '../GluuSelectRow'
import AppTestWrapper from './Components/AppTestWrapper'

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

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue(value)
  })

  test('renders select with all options', () => {
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

    const select = screen.getByRole('combobox')
    values.forEach((optionValue) => {
      expect(screen.getByRole('option', { name: optionValue })).toBeInTheDocument()
    })
    expect(select).toHaveValue(value)
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

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option3' } })

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

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'option1' } })

    expect(formikHandleChangeMock).toHaveBeenCalledTimes(1)
    expect(handleChangeMock).toHaveBeenCalledTimes(1)
  })
})
