import { render, screen } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JsonViewer from 'Plugins/auth-server/components/JsonViewer/components/JsonViewer'
import { THEME_DARK, THEME_LIGHT } from '@/context/theme/constants'

const renderViewer = (ui: React.ReactElement) => render(ui, { wrapper: AppTestWrapper })

describe('JsonViewer', () => {
  it('renders object data', () => {
    const { container } = renderViewer(<JsonViewer data={{ name: 'gluu' }} />)
    expect(container.querySelector('.json-viewer')).toBeInTheDocument()
    expect(screen.getByText(/name/)).toBeInTheDocument()
  })

  it('renders array data', () => {
    const { container } = renderViewer(<JsonViewer data={['a', 'b']} />)
    expect(container.querySelector('.json-viewer')).toBeInTheDocument()
  })

  it('falls back to an empty object for non-object data without crashing', () => {
    const { container } = renderViewer(<JsonViewer data={'not-an-object'} />)
    expect(container.querySelector('.json-viewer')).toBeInTheDocument()
  })

  it('applies a custom className', () => {
    const { container } = renderViewer(<JsonViewer data={{ a: 1 }} className="custom-cls" />)
    expect(container.querySelector('.json-viewer.custom-cls')).toBeInTheDocument()
  })

  it('renders with the dark theme', () => {
    const { container } = renderViewer(<JsonViewer data={{ a: 1 }} theme={THEME_DARK} />)
    expect(container.querySelector('.json-viewer')).toBeInTheDocument()
  })

  it('renders with the light theme', () => {
    const { container } = renderViewer(<JsonViewer data={{ a: 1 }} theme={THEME_LIGHT} />)
    expect(container.querySelector('.json-viewer')).toBeInTheDocument()
  })

  it('applies a custom background color', () => {
    const { container } = renderViewer(
      <JsonViewer data={{ a: 1 }} backgroundColor="rgb(10, 20, 30)" />,
    )
    const el = container.querySelector('.json-viewer') as HTMLElement
    expect(el.style.backgroundColor).toBe('rgb(10, 20, 30)')
  })
})
