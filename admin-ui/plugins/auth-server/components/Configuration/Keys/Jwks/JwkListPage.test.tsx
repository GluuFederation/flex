import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import JwkListPage from './JwkListPage'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { formatDate } from '../../../../../../app/utils/dayjsUtils'
import { mockJwksConfig } from '../__tests__/fixtures/jwkTestData'
import { DATE_FORMAT } from '../constants'
import { useJwkApi } from '../hooks'

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

jest.mock('../hooks', () => ({
  useJwkApi: jest.fn(() => ({
    jwks: mockJwksConfig,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useJwkActions: jest.fn(() => ({
    navigateToKeysList: jest.fn(),
  })),
}))

const mockClasses: Record<string, string> = {
  pageCard: 'pageCard',
  sectionTitle: 'sectionTitle',
  accordionWrapper: 'accordionWrapper',
  accordionHeader: 'accordionHeader',
  accordionHeaderOpen: 'accordionHeaderOpen',
  accordionIcon: 'accordionIcon',
  accordionBody: 'accordionBody',
  fieldsGrid: 'fieldsGrid',
  fieldItem: 'fieldItem',
  fieldItemFullWidth: 'fieldItemFullWidth',
  formLabels: 'formLabels',
  footer: 'footer',
  infoAlert: 'infoAlert',
  infoIcon: 'infoIcon',
  infoText: 'infoText',
  divider: 'divider',
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

describe('JwkListPage', () => {
  it('should render jwks page properly', () => {
    render(<JwkListPage classes={mockClasses} />, {
      wrapper: Wrapper,
    })

    const firstKey = mockJwksConfig.keys?.[0]
    const headerText = firstKey?.name ?? 'Unnamed Key'
    expect(screen.getByText(headerText)).toBeInTheDocument()

    // Expand the accordion
    fireEvent.click(screen.getByText(headerText))

    expect(screen.getByTestId('x5c')).toHaveValue(firstKey?.x5c?.[0] ?? '')
    expect(screen.getByTestId('kid')).toHaveValue(firstKey?.kid ?? '')
    expect(screen.getByTestId('kty')).toHaveValue(firstKey?.kty ?? '')
    expect(screen.getByTestId('use')).toHaveValue(firstKey?.use ?? '')
    expect(screen.getByTestId('alg')).toHaveValue(firstKey?.alg ?? '')
    const expectedExp = firstKey?.exp != null ? formatDate(firstKey.exp, DATE_FORMAT) : ''
    expect(screen.getByTestId('exp')).toHaveValue(expectedExp)
  })

  it('should handle undefined exp gracefully', () => {
    const mockedUseJwkApi = useJwkApi as jest.Mock
    const keys = mockJwksConfig.keys ?? []
    mockedUseJwkApi.mockReturnValue({
      jwks: {
        keys: [{ ...keys[0], exp: undefined }],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<JwkListPage classes={mockClasses} />, { wrapper: Wrapper })

    const headerText = keys[0]?.name ?? 'Unnamed Key'
    fireEvent.click(screen.getByText(headerText))

    expect(screen.getByTestId('exp')).toHaveValue('')
  })

  it('should handle null exp gracefully', () => {
    const mockedUseJwkApi = useJwkApi as jest.Mock
    const keys = mockJwksConfig.keys ?? []
    mockedUseJwkApi.mockReturnValue({
      jwks: {
        keys: [{ ...keys[0], exp: null }],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<JwkListPage classes={mockClasses} />, { wrapper: Wrapper })

    const headerText = keys[0]?.name ?? 'Unnamed Key'
    fireEvent.click(screen.getByText(headerText))

    expect(screen.getByTestId('exp')).toHaveValue('')
  })
})
