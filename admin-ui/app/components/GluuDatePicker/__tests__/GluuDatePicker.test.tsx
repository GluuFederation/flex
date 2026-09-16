import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GluuDatePicker } from '@/components/GluuDatePicker/GluuDatePicker'
import { createDate } from '@/utils/dayjsUtils'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

// GluuDatePicker lazy-loads the MUI pickers, so a render has to clear the Suspense boundary
// before any field exists in the DOM.
const renderPicker = async (ui: React.ReactElement) => {
  const result = render(ui, { wrapper: Wrapper })
  await waitFor(() => expect(result.container.querySelector('input')).toBeInTheDocument())
  return result
}

// MUI X date pickers render a hidden <input> per field that carries the
// formatted value, plus a sectioned span group for editing. Reading the
// underlying input value is the reliable way to assert the displayed value.
const getInputs = (container: HTMLElement): HTMLInputElement[] =>
  Array.from(container.querySelectorAll('input'))

// The field label text is mirrored in both the <label> and the outline's
// <legend>, so match on the actual <label> element to stay unambiguous.
const getFieldLabels = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('label')).map((label) => label.textContent ?? '')

const openCalendarAndPickDay = (dayLabel: string): void => {
  const triggers = screen.getAllByRole('button', { name: /choose date/i })
  fireEvent.click(triggers[0])
  const day = screen.getAllByRole('gridcell').find((cell) => cell.textContent === dayLabel)
  if (day) {
    fireEvent.click(day)
  }
}

describe('GluuDatePicker (single mode)', () => {
  it('renders a single date field with the provided label', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker mode="single" label="Birth Date" onChange={jest.fn()} />,
    )
    expect(getFieldLabels(container)).toContain('Birth Date')
  })

  it('displays the passed value formatted with the default US format (MM/DD/YYYY)', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker
        mode="single"
        label="When"
        value={createDate('2024-01-15')}
        onChange={jest.fn()}
      />,
    )
    expect(getInputs(container)[0].value).toBe('01/15/2024')
  })

  it('renders an empty field when no value is provided', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker mode="single" label="When" onChange={jest.fn()} />,
    )
    expect(getInputs(container)[0].value).toBe('')
  })

  it('respects a custom display format', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker
        mode="single"
        label="When"
        value={createDate('2024-01-15')}
        dateFormat="YYYY-MM-DD"
        onChange={jest.fn()}
      />,
    )
    expect(getInputs(container)[0].value).toBe('2024-01-15')
  })

  it('exposes a "Choose date" trigger that opens a calendar', async () => {
    await renderPicker(<GluuDatePicker mode="single" label="When" onChange={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /choose date/i }))
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('fires onChange when a day is selected from the calendar', async () => {
    const onChange = jest.fn()
    await renderPicker(
      <GluuDatePicker
        mode="single"
        label="When"
        value={createDate('2024-01-15')}
        onChange={onChange}
      />,
    )
    openCalendarAndPickDay('20')
    expect(onChange).toHaveBeenCalled()
  })
})

describe('GluuDatePicker (range mode)', () => {
  it('renders two fields with default Start Date / End Date labels', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker
        mode="range"
        startDate={null}
        endDate={null}
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
      />,
    )
    const labels = getFieldLabels(container)
    expect(labels).toContain('Start Date')
    expect(labels).toContain('End Date')
  })

  it('displays the start and end date values in their respective fields', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker
        mode="range"
        startDate={createDate('2024-03-01')}
        endDate={createDate('2024-03-31')}
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
      />,
    )
    const inputs = getInputs(container)
    expect(inputs[0].value).toBe('03/01/2024')
    expect(inputs[1].value).toBe('03/31/2024')
  })

  it('honors custom start/end date labels', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker
        mode="range"
        startDate={null}
        endDate={null}
        startDateLabel="From"
        endDateLabel="To"
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
      />,
    )
    const labels = getFieldLabels(container)
    expect(labels).toContain('From')
    expect(labels).toContain('To')
  })

  it('fires onStartDateChange when a day is picked in the start calendar', async () => {
    const onStartDateChange = jest.fn()
    await renderPicker(
      <GluuDatePicker
        mode="range"
        startDate={createDate('2024-04-01')}
        endDate={null}
        onStartDateChange={onStartDateChange}
        onEndDateChange={jest.fn()}
      />,
    )
    openCalendarAndPickDay('15')
    expect(onStartDateChange).toHaveBeenCalled()
  })

  it('renders title labels (not field labels) when labelAsTitle is set', async () => {
    const { container } = await renderPicker(
      <GluuDatePicker
        mode="range"
        startDate={null}
        endDate={null}
        labelAsTitle
        layout="row"
        onStartDateChange={jest.fn()}
        onEndDateChange={jest.fn()}
      />,
    )
    // labelAsTitle renders the labels as standalone "Start Date:" / "End Date:" text
    expect(screen.getByText('Start Date:')).toBeInTheDocument()
    expect(screen.getByText('End Date:')).toBeInTheDocument()
    // and the field <label> elements are dropped
    expect(container.querySelectorAll('label')).toHaveLength(0)
  })
})
