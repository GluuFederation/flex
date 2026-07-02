import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { SummaryCard } from '../SummaryCard'

const classes = { summary: 'summary', summaryText: 'summaryText', summaryValue: 'summaryValue' }

const renderCard = (value: number | null, text = 'Active Users') =>
  render(<SummaryCard text={text} value={value} classes={classes} />, { wrapper: AppTestWrapper })

describe('SummaryCard', () => {
  it('renders the label text', () => {
    renderCard(42)
    expect(screen.getByText('Active Users')).toBeInTheDocument()
  })

  it('renders a numeric value', () => {
    renderCard(42)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders zero as a value rather than the dash fallback', () => {
    renderCard(0)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText('—')).not.toBeInTheDocument()
  })

  it('renders the em-dash fallback when the value is null', () => {
    renderCard(null)
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
