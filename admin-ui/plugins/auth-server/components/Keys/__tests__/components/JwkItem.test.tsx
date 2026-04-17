import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import i18n from '@/i18n'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JwkItem from '../../components/JwkItem'
import { mockJwksConfig } from '../fixtures/jwkTestData'
import type { JSONWebKey } from '../../types'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Keys: 'Keys', Lock: 'Lock', Webhooks: 'Webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Keys: [], Lock: [], Webhooks: [] },
}))

const mockClasses: Record<string, string> = {
  accordionWrapper: 'accordionWrapper',
  accordionHeader: 'accordionHeader',
  accordionHeaderOpen: 'accordionHeaderOpen',
  accordionIcon: 'accordionIcon',
  accordionBody: 'accordionBody',
  fieldsGrid: 'fieldsGrid',
  fieldItem: 'fieldItem',
  fieldItemFullWidth: 'fieldItemFullWidth',
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const mockItem = mockJwksConfig.keys?.[0] as JSONWebKey

describe('JwkItem', () => {
  it('renders accordion header with key name', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    expect(screen.getByText(mockItem.name ?? '')).toBeInTheDocument()
  })

  it('does not render body when collapsed', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    expect(screen.queryByTestId('kid')).not.toBeInTheDocument()
  })

  it('renders body fields when expanded', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText(mockItem.name ?? ''))

    expect(screen.getByTestId('kid')).toHaveValue(mockItem.kid ?? '')
    expect(screen.getByTestId('kty')).toHaveValue(mockItem.kty ?? '')
    expect(screen.getByTestId('use')).toHaveValue(mockItem.use ?? '')
    expect(screen.getByTestId('alg')).toHaveValue(mockItem.alg ?? '')
    expect(screen.getByTestId('e')).toHaveValue(mockItem.e ?? '')
    expect(screen.getByTestId('description')).toHaveValue(mockItem.descr ?? '')
  })

  it('renders x5c textarea when expanded', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText(mockItem.name ?? ''))

    expect(screen.getByTestId('x5c')).toHaveValue(mockItem.x5c?.[0] ?? '')
  })

  it('renders n field when present', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText(mockItem.name ?? ''))

    expect(screen.getByTestId('n')).toHaveValue(mockItem.n ?? '')
  })

  it('collapses when clicked again', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    const header = screen.getByText(mockItem.name ?? '')

    fireEvent.click(header)
    expect(screen.getByTestId('kid')).toBeInTheDocument()

    fireEvent.click(header)
    expect(screen.queryByTestId('kid')).not.toBeInTheDocument()
  })

  it('toggles on Enter key press', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    const header = screen.getByRole('button')

    fireEvent.keyDown(header, { key: 'Enter' })
    expect(screen.getByTestId('kid')).toBeInTheDocument()

    fireEvent.keyDown(header, { key: 'Enter' })
    expect(screen.queryByTestId('kid')).not.toBeInTheDocument()
  })

  it('renders Unnamed Key when name is missing', () => {
    const itemWithoutName = { ...mockItem, name: undefined }
    render(<JwkItem item={itemWithoutName} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    const expectedLabel = i18n.t('fields.unnamed_key')
    expect(screen.getByText(expectedLabel)).toBeInTheDocument()
  })

  it('applies accordionHeaderOpen class when expanded', () => {
    render(<JwkItem item={mockItem} index={0} classes={mockClasses} />, { wrapper: Wrapper })
    const header = screen.getByRole('button')

    expect(header.className).not.toContain('accordionHeaderOpen')
    fireEvent.click(header)
    expect(header.className).toContain('accordionHeaderOpen')
  })
})
