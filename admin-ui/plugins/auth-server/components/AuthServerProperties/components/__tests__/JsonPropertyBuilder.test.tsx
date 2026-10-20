import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import JsonPropertyBuilder from '../JsonPropertyBuilder'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const renderBuilder = (props: Partial<React.ComponentProps<typeof JsonPropertyBuilder>> = {}) =>
  render(
    <JsonPropertyBuilder
      propKey="myField"
      propValue="hello"
      lSize={4}
      handler={jest.fn()}
      {...props}
    />,
    { wrapper: AppTestWrapper },
  )

describe('JsonPropertyBuilder', () => {
  it('renders a text input for a string property with its current value', () => {
    renderBuilder()
    const input = screen.getByDisplayValue('hello')
    expect(input).toBeInTheDocument()
  })

  it('emits a replace patch at the property path on change', () => {
    const handler = jest.fn()
    renderBuilder({ handler })
    fireEvent.change(screen.getByDisplayValue('hello'), { target: { value: 'world' } })
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ op: 'replace', path: '/myField', value: 'world' }),
    )
  })
})

const probeRenders = jest.fn()
const TranslatedProbe = () => {
  useTranslation()
  probeRenders()
  return null
}
const MemoizedProbe = React.memo(TranslatedProbe)

describe('JsonPropertyBuilder label for a key missing from the translations', () => {
  it('is added without re-rendering other translated components', () => {
    const Harness = ({ showField }: { showField: boolean }) => (
      <>
        <MemoizedProbe />
        {showField && (
          <JsonPropertyBuilder
            propKey="zzAuthServerLabelProbe"
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

    expect(screen.getByText(/Zz Auth Server Label Probe/)).toBeInTheDocument()
    expect(probeRenders).not.toHaveBeenCalled()
  })
})
