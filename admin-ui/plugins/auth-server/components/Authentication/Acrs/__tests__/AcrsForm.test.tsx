import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from '../../__tests__/helpers/authenticationTestUtils'
import AcrsForm from '../AcrsForm'
import type { AuthNItem } from '../../types'
import { AUTH_METHOD_NAMES } from '../../constants'

const simplePasswordItem: AuthNItem = {
  name: AUTH_METHOD_NAMES.SIMPLE_PASSWORD,
  acrName: AUTH_METHOD_NAMES.SIMPLE_PASSWORD,
  level: -1,
  description: 'Built-in default password authentication',
  samlACR: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
  primaryKey: 'uid',
  passwordAttribute: 'userPassword',
  hashAlgorithm: 'bcrypt',
}

const ldapItem: AuthNItem = {
  name: AUTH_METHOD_NAMES.DEFAULT_LDAP,
  acrName: AUTH_METHOD_NAMES.DEFAULT_LDAP,
  level: 1,
  description: 'LDAP authentication',
  configId: 'test-ldap',
  bindDN: 'cn=directory manager',
  bindPassword: 'secret',
  maxConnections: 10,
  primaryKey: 'uid',
  localPrimaryKey: 'uid',
  servers: ['localhost:1636'],
  baseDNs: ['ou=people,o=jans'],
  useSSL: true,
  enabled: true,
}

const scriptItem: AuthNItem = {
  inum: 'test-inum',
  name: 'myAuthnScript',
  acrName: 'test_otp',
  isCustomScript: true,
  level: 5,
  description: 'Test OTP authentication script',
  enabled: true,
  configurationProperties: [{ key: 'k1', value: 'v1' }],
}

describe('AcrsForm', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  describe('rendering', () => {
    it('renders without crashing for a simple password item', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByText(/Level/i)).toBeInTheDocument()
    })

    it('renders the acr field as disabled and populated', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      const acrInput = screen.getByDisplayValue(AUTH_METHOD_NAMES.SIMPLE_PASSWORD)
      expect(acrInput).toBeDisabled()
    })

    it('renders footer Back, Cancel and Apply buttons', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('simple password fields', () => {
    it('renders the primary key field populated', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByDisplayValue('uid')).toBeInTheDocument()
    })

    it('renders the password attribute field populated', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByDisplayValue('userPassword')).toBeInTheDocument()
    })
  })

  describe('ldap fields', () => {
    it('renders ldap-specific fields when item is default ldap', () => {
      render(<AcrsForm item={ldapItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByDisplayValue('cn=directory manager')).toBeInTheDocument()
    })

    it('renders max connections value for ldap item', () => {
      render(<AcrsForm item={ldapItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
    })
  })

  describe('custom script properties', () => {
    it('renders the add property button for a custom script item', () => {
      render(<AcrsForm item={scriptItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByText(/Add Property/i)).toBeInTheDocument()
    })

    it('adds a configuration property row when add button is clicked', async () => {
      render(<AcrsForm item={scriptItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      const initialRemove = screen.getAllByText(/Remove/i).length
      fireEvent.click(screen.getByText(/Add Property/i))
      await waitFor(() => {
        expect(screen.getAllByText(/Remove/i)).toHaveLength(initialRemove + 1)
      })
    })
  })

  describe('footer state', () => {
    it('disables Cancel button when the form is not dirty', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByText(/Cancel/i).closest('button')).toBeDisabled()
    })

    it('disables Apply button when the form is not dirty', () => {
      render(<AcrsForm item={simplePasswordItem} handleSubmit={jest.fn()} />, { wrapper: Wrapper })
      expect(screen.getByText(/Apply/i).closest('button')).toBeDisabled()
    })
  })
})
