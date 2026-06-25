import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DateRangeSelector from '../DateRangeSelector'
import dayjs from 'dayjs'
import { DATE_PRESETS } from '../../constants'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const baseProps = {
  startDate: dayjs('2024-01-01'),
  endDate: dayjs('2024-03-01'),
  selectedPreset: 3,
  onStartDateChange: jest.fn(),
  onEndDateChange: jest.fn(),
  onPresetSelect: jest.fn(),
  onApply: jest.fn(),
  isLoading: false,
}

const renderSelector = (props: Partial<typeof baseProps> = {}) =>
  render(<DateRangeSelector {...baseProps} {...props} />, { wrapper: AppTestWrapper })

describe('DateRangeSelector', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders a button for every preset', () => {
    renderSelector()
    expect(screen.getByRole('button', { name: '3 Months' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '6 Months' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1 Year' })).toBeInTheDocument()
  })

  it('calls onPresetSelect with the preset months when a preset is clicked', () => {
    const onPresetSelect = jest.fn()
    renderSelector({ onPresetSelect })
    fireEvent.click(screen.getByRole('button', { name: '6 Months' }))
    expect(onPresetSelect).toHaveBeenCalledWith(DATE_PRESETS[1].months)
  })

  it('calls onApply when the view button is clicked', () => {
    const onApply = jest.fn()
    renderSelector({ onApply })
    fireEvent.click(screen.getByRole('button', { name: /view/i }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('disables the view button while loading', () => {
    renderSelector({ isLoading: true })
    expect(screen.getByRole('button', { name: /view/i })).toBeDisabled()
  })
})
