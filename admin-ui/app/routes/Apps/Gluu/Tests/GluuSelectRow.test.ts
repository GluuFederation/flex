// @ts-nocheck
import { fireEvent, screen } from '@testing-library/dom'
import GluuSelectRow from '../GluuSelectRow'
import { render } from '@testing-library/react'

const label = 'Select Option:'
const name = 'selectName'
const value = 'option2'
const values = ['option1', 'option2', 'option3']

describe('GluuSelectRow', () => {
  // Mock the formik object and its handleChange method
  const formikHandleChangeMock = jest.fn()
  const formikMock = {
    handleChange: formikHandleChangeMock,
  }

  test('renders select with formik handle change & update value', () => {
    render(
      <GluuSelectRow
        label={label}
        name={name}
        value={value}
        values={values}
        formik={formikMock}
      />
    )

    const selectElement = screen.getByTestId(name)

    expect(selectElement.value).toBe(value)

    const newValue = 'option3'
    fireEvent.change(selectElement, { target: { value: newValue } })

    // Ensure that the handleChange method from formikMock was called with the correct arguments
    expect(formikHandleChangeMock).toHaveBeenCalledTimes(1)
    expect(formikHandleChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name,
          value: newValue,
        }),
      })
    )
  })

  test('renders select with prop handle change method & update value', () => {
    // Mock handleChange method
    const handleChangeMock = jest.fn()

    render(
      <GluuSelectRow
        label={label}
        name={name}
        value={value}
        values={values}
        formik={formikMock}
        handleChange={handleChangeMock}
      />
    )

    const selectElement = screen.getByTestId(name)

    expect(selectElement.value).toBe(value)

    const newValue = 'option1'

    // Ensure that the props handleChange method was called
    fireEvent.change(selectElement, { target: { value: newValue } })

    // Retrieve the event
    const eventArgument = handleChangeMock.mock.calls[0][0]

    expect(handleChangeMock).toHaveBeenCalledTimes(1)
    expect(handleChangeMock).toHaveBeenCalledWith(eventArgument)

    // updates with new value option1
    expect(selectElement.value).toBe(newValue)
  })
})
