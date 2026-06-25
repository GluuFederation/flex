import { render, screen, fireEvent, within } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import type { GluuTabsProps } from 'Routes/Apps/Gluu/types/GluuComponentPropsTypes'

const baseProps = (overrides: Partial<GluuTabsProps> = {}): GluuTabsProps => ({
  tabNames: ['General', 'Advanced'],
  tabToShow: (id: string) => <div>Panel {id}</div>,
  ...overrides,
})

const renderTabs = (props: GluuTabsProps) =>
  render(
    <AppTestWrapper>
      <GluuTabs {...props} />
    </AppTestWrapper>,
  )

describe('GluuTabs', () => {
  it('renders a tab per tabNames entry with a data-testid', () => {
    renderTabs(baseProps())
    expect(screen.getByTestId('General')).toBeInTheDocument()
    expect(screen.getByTestId('Advanced')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('renders the active tab panel content and hides inactive panels', () => {
    renderTabs(baseProps())
    expect(screen.getByText('Panel General')).toBeInTheDocument()

    const panels = screen.getAllByRole('tabpanel', { hidden: true })
    expect(panels).toHaveLength(2)
    expect(panels[0]).not.toHaveAttribute('hidden')
    expect(panels[1]).toHaveAttribute('hidden')
  })

  it('switches the panel and calls onTabChange when a tab is clicked', () => {
    const onTabChange = jest.fn()
    renderTabs(baseProps({ onTabChange }))

    fireEvent.click(screen.getByTestId('Advanced'))

    expect(onTabChange).toHaveBeenCalledTimes(1)
    expect(onTabChange).toHaveBeenCalledWith(1)
    expect(screen.getByText('Panel Advanced')).toBeInTheDocument()
  })

  it('selects the initial tab according to defaultTab', () => {
    renderTabs(baseProps({ defaultTab: 1 }))
    expect(screen.getByText('Panel Advanced')).toBeInTheDocument()

    const panels = screen.getAllByRole('tabpanel', { hidden: true })
    expect(panels[0]).toHaveAttribute('hidden')
    expect(panels[1]).not.toHaveAttribute('hidden')
  })

  it('renders the rightAction when provided', () => {
    renderTabs(baseProps({ rightAction: <button type="button">Extra Action</button> }))
    expect(screen.getByRole('button', { name: 'Extra Action' })).toBeInTheDocument()
  })

  it('supports object tab entries and uses their id for tabToShow', () => {
    renderTabs(
      baseProps({
        tabNames: [
          { name: 'First', id: 'first-id' },
          { name: 'Second', id: 'second-id' },
        ],
        tabToShow: (id: string) => <div>Content for {id}</div>,
      }),
    )

    expect(screen.getByTestId('First')).toBeInTheDocument()
    expect(screen.getByTestId('Second')).toBeInTheDocument()
    expect(screen.getByText('Content for first-id')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('Second'))
    expect(screen.getByText('Content for second-id')).toBeInTheDocument()
  })

  it('renders the tab label inside each tab element', () => {
    renderTabs(baseProps())
    const generalTab = screen.getByTestId('General')
    expect(within(generalTab).getByText('General')).toBeInTheDocument()
  })
})
