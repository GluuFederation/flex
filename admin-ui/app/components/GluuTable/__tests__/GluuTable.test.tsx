import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import GluuTable from '@/components/GluuTable/GluuTable'
import type { ColumnDef } from '@/components/GluuTable/types'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

type Row = {
  id: string
  name: string
  count: number
}

const columns: ColumnDef<Row>[] = [
  { key: 'name', label: 'Name' },
  { key: 'count', label: 'Count' },
]

const data: Row[] = [
  { id: 'a', name: 'Charlie', count: 3 },
  { id: 'b', name: 'Alpha', count: 1 },
  { id: 'c', name: 'Bravo', count: 2 },
]

const getRows = (): HTMLElement[] =>
  screen
    .getAllByRole('row')
    .filter(
      (row) => within(row).queryAllByRole('cell').length > 0 && !row.getAttribute('aria-hidden'),
    )

const getNameColumnOrder = (): string[] =>
  getRows()
    .map((row) => within(row).queryAllByRole('cell')[0]?.textContent?.trim())
    .filter((v): v is string => !!v)

describe('GluuTable', () => {
  it('renders all rows and column headers', () => {
    render(<GluuTable columns={columns} data={data} />, { wrapper: Wrapper })
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Count')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Bravo')).toBeInTheDocument()
  })

  it('renders the empty message when there is no data', () => {
    render(<GluuTable columns={columns} data={[]} emptyMessage="Nothing here" />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('sorts ascending on first header click and toggles to descending on second click (never clears)', () => {
    render(<GluuTable columns={columns} data={data} />, { wrapper: Wrapper })
    const nameHeader = screen.getByRole('button', { name: /Name/i })

    fireEvent.click(nameHeader)
    expect(getNameColumnOrder()).toEqual(['Alpha', 'Bravo', 'Charlie'])

    fireEvent.click(nameHeader)
    expect(getNameColumnOrder()).toEqual(['Charlie', 'Bravo', 'Alpha'])

    // third click stays sorted (2-state cycle: asc <-> desc, no clear back to insertion order)
    fireEvent.click(nameHeader)
    expect(getNameColumnOrder()).toEqual(['Alpha', 'Bravo', 'Charlie'])
  })

  it('keeps the last column resize handle hidden when there are no actions', () => {
    render(<GluuTable columns={columns} data={data} />, { wrapper: Wrapper })
    const resizeHandles = screen.getAllByRole('separator', { name: /Resize column/i })
    // 2 columns, no actions -> only the first column gets a resize handle
    expect(resizeHandles).toHaveLength(columns.length - 1)
  })

  it('shows a resize handle on every column when actions are present', () => {
    const actions = [{ icon: 'icon', tooltip: 'Edit', onClick: jest.fn() }]
    render(<GluuTable columns={columns} data={data} actions={actions} />, { wrapper: Wrapper })
    const resizeHandles = screen.getAllByRole('separator', { name: /Resize column/i })
    expect(resizeHandles).toHaveLength(columns.length)
  })
})
