import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import GluuToggleRow from '../GluuToggleRow'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const LABEL = 'Enable Feature'
const NAME = 'enabledFeature'

const ControlledRow = ({ onToggle }: { onToggle: (checked: boolean) => void }) => {
  const [value, setValue] = useState(true)
  return (
    <GluuToggleRow
      label={LABEL}
      name={NAME}
      value={value}
      handler={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.checked)
        onToggle(event.target.checked)
      }}
    />
  )
}

describe('GluuToggleRow', () => {
  it('renders the label and a toggle reflecting value, firing handler on toggle', () => {
    const onToggle = jest.fn()
    render(
      <AppTestWrapper>
        <ControlledRow onToggle={onToggle} />
      </AppTestWrapper>,
    )

    expect(screen.getByText(/Enable Feature/i)).toBeInTheDocument()
    const toggle = screen.getByTestId(NAME) as HTMLInputElement
    expect(toggle.checked).toBe(true)

    fireEvent.click(toggle)
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(toggle.checked).toBe(false)
  })

  it('hides the label when isLabelVisible is false', () => {
    render(
      <AppTestWrapper>
        <GluuToggleRow label={LABEL} name={NAME} value={false} isLabelVisible={false} />
      </AppTestWrapper>,
    )

    expect(screen.queryByText(/Enable Feature/i)).not.toBeInTheDocument()
    expect(screen.getByTestId(NAME)).toBeInTheDocument()
  })

  it('disables the toggle when viewOnly', () => {
    render(
      <AppTestWrapper>
        <GluuToggleRow label={LABEL} name={NAME} value viewOnly />
      </AppTestWrapper>,
    )

    expect((screen.getByTestId(NAME) as HTMLInputElement).disabled).toBe(true)
  })
})
