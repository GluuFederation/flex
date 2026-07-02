import { render, screen } from '@testing-library/react'
import { withPageConfig } from '../withPageConfig'
import { PageConfigContext } from '../PageConfigContext'
import type { PageConfig } from '../types'

type ProbeProps = { pageConfig?: PageConfig | null; label: string }

// Echoes the injected pageConfig so we can assert what the HOC provided.
const Probe = ({ pageConfig, label }: ProbeProps) => (
  <div data-testid="probe" data-collapsed={String(pageConfig?.sidebarCollapsed)}>
    {label}
  </div>
)

describe('withPageConfig', () => {
  it('injects the context pageConfig into the wrapped component', () => {
    const Wrapped = withPageConfig(Probe)
    const config: PageConfig = {
      sidebarCollapsed: true,
      screenSize: 'lg',
      toggleSidebar: () => {},
    }
    render(
      <PageConfigContext value={config}>
        <Wrapped label="hello" />
      </PageConfigContext>,
    )
    expect(screen.getByTestId('probe')).toHaveAttribute('data-collapsed', 'true')
  })

  it('forwards the remaining props through to the wrapped component', () => {
    const Wrapped = withPageConfig(Probe)
    render(
      <PageConfigContext value={{ sidebarCollapsed: false, toggleSidebar: () => {} }}>
        <Wrapped label="forwarded" />
      </PageConfigContext>,
    )
    expect(screen.getByTestId('probe')).toHaveTextContent('forwarded')
  })

  it('uses the default context config when no provider is present', () => {
    const Wrapped = withPageConfig(Probe)
    render(<Wrapped label="default" />)
    // The default PageConfigContext has sidebarCollapsed: false.
    expect(screen.getByTestId('probe')).toHaveAttribute('data-collapsed', 'false')
  })
})
