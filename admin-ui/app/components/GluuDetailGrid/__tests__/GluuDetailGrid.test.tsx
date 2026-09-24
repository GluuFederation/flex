import React from 'react'
import { render, screen } from '@testing-library/react'
import { GluuDetailGrid } from '@/components/GluuDetailGrid'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const mockFields = [
  { label: 'fields.inum', value: '09A0-93D7', doc_entry: 'inum' },
  { label: 'fields.name', value: 'smpp', doc_entry: 'name' },
  { label: 'fields.script_type', value: 'person_authentication', doc_entry: 'scriptType' },
]

it('renders all field labels and values', () => {
  render(<GluuDetailGrid fields={mockFields} />, { wrapper: Wrapper })
  expect(screen.getByText(/Inum/i)).toBeInTheDocument()
  expect(screen.getByText(/Name/i)).toBeInTheDocument()
  expect(screen.getByText(/Script Type/i)).toBeInTheDocument()
  expect(screen.getByText('09A0-93D7')).toBeInTheDocument()
  expect(screen.getByText('smpp')).toBeInTheDocument()
  expect(screen.getByText('person_authentication')).toBeInTheDocument()
})

it('renders with defaultDocCategory', () => {
  render(<GluuDetailGrid fields={mockFields} defaultDocCategory="SCRIPT" />, {
    wrapper: Wrapper,
  })
  expect(screen.getByText('smpp')).toBeInTheDocument()
})

it('renders with labelStyle', () => {
  render(<GluuDetailGrid fields={mockFields} labelStyle={{ color: 'red' }} />, { wrapper: Wrapper })
  const label = screen.getByText(/Inum/i)
  expect(label).toBeInTheDocument()
  expect(label).toHaveStyle({ color: 'rgb(255, 0, 0)' })
})

it('sizes the columns to the widest label', () => {
  const labelWidths: Record<string, number> = { 'Inum:': 40, 'Name:': 60, 'Script Type:': 180 }
  const rectSpy = jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      return { width: labelWidths[this.textContent ?? ''] ?? 0 } as DOMRect
    })

  const { container } = render(<GluuDetailGrid fields={mockFields} />, { wrapper: Wrapper })
  const grid = container.querySelector<HTMLElement>('[style*="--detail-label-width"]')

  expect(grid?.style.getPropertyValue('--detail-label-width')).toBe('180px')
  rectSpy.mockRestore()
})
