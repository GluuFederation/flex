import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import JsonPropertyBuilderConfigApi from '../JsonPropertyBuilderConfigApi'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const renderBuilder = (
  props: Partial<React.ComponentProps<typeof JsonPropertyBuilderConfigApi>> = {},
) =>
  render(
    <JsonPropertyBuilderConfigApi
      propKey="myField"
      propValue="hello"
      lSize={4}
      handler={jest.fn()}
      {...props}
    />,
    { wrapper: AppTestWrapper },
  )

describe('JsonPropertyBuilderConfigApi', () => {
  it('renders a text input for a string property with its current value', () => {
    renderBuilder()
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('emits a replace patch at the property path on change', () => {
    const handler = jest.fn()
    renderBuilder({ handler })
    fireEvent.change(screen.getByDisplayValue('hello'), { target: { value: 'world' } })
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ op: 'replace', path: '/myField', value: 'world' }),
    )
  })

  it('renders the input as disabled when the disabled prop is set', () => {
    renderBuilder({ disabled: true })
    expect(screen.getByDisplayValue('hello')).toBeDisabled()
  })

  it('shows the edited list instead of the loaded one after a pill is removed', () => {
    renderBuilder({
      propKey: 'apiApprovedIssuer',
      propValue: ['https://one.example', 'https://two.example'],
      editedTopLevelValue: ['https://one.example'],
    })

    expect(screen.getByTitle('https://one.example')).toBeInTheDocument()
    expect(screen.queryByTitle('https://two.example')).not.toBeInTheDocument()
  })

  it('shows the edited list for a field nested in an object', () => {
    renderBuilder({
      propKey: 'scopes',
      propValue: ['openid', 'profile'],
      path: '/agamaConfiguration',
      editedTopLevelValue: { scopes: ['openid', 'email'] },
    })

    expect(screen.getByTitle('email')).toBeInTheDocument()
    expect(screen.queryByTitle('profile')).not.toBeInTheDocument()
  })

  it('falls back to the loaded list when the form has no value for it', () => {
    renderBuilder({
      propKey: 'apiApprovedIssuer',
      propValue: ['https://one.example'],
      editedTopLevelValue: undefined,
    })

    expect(screen.getByTitle('https://one.example')).toBeInTheDocument()
  })

  it('emits a replace patch without the removed pill', () => {
    const handler = jest.fn()
    renderBuilder({
      handler,
      propKey: 'apiApprovedIssuer',
      propValue: ['https://one.example', 'https://two.example'],
    })

    fireEvent.click(within(screen.getByTitle('https://two.example')).getByRole('button'))

    expect(handler).toHaveBeenCalledWith({
      op: 'replace',
      path: '/apiApprovedIssuer',
      value: ['https://one.example'],
    })
  })

  it('shows the edited logging level instead of the loaded one', () => {
    renderBuilder({
      propKey: 'loggingLevel',
      propValue: 'INFO',
      editedTopLevelValue: 'DEBUG',
    })

    expect(screen.getByDisplayValue('DEBUG')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('INFO')).not.toBeInTheDocument()
  })

  it('keeps a removed value in the dropdown so it can be added back', () => {
    const handler = jest.fn()
    renderBuilder({
      handler,
      propKey: 'apiApprovedIssuer',
      propValue: ['https://one.example', 'https://two.example'],
      editedTopLevelValue: ['https://one.example'],
    })

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(within(screen.getByRole('listbox')).getByText('https://two.example'))

    expect(handler).toHaveBeenCalledWith({
      op: 'replace',
      path: '/apiApprovedIssuer',
      value: ['https://one.example', 'https://two.example'],
    })
  })
})

const probeRenders = jest.fn()
const TranslatedProbe = () => {
  useTranslation()
  probeRenders()
  return null
}
const MemoizedProbe = React.memo(TranslatedProbe)

describe('JsonPropertyBuilderConfigApi label for a key missing from the translations', () => {
  it('is added without re-rendering other translated components', () => {
    const Harness = ({ showField }: { showField: boolean }) => (
      <>
        <MemoizedProbe />
        {showField && (
          <JsonPropertyBuilderConfigApi
            propKey="zzConfigApiLabelProbe"
            propValue="value"
            lSize={4}
            handler={jest.fn()}
          />
        )}
      </>
    )
    const { rerender } = render(<Harness showField={false} />, { wrapper: AppTestWrapper })
    probeRenders.mockClear()

    rerender(<Harness showField />)

    expect(screen.getByText(/Zz Config Api Label Probe/)).toBeInTheDocument()
    expect(probeRenders).not.toHaveBeenCalled()
  })
})
