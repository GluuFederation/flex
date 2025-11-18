import React from 'react'
import { render, screen } from '@testing-library/react'
import JwkListPage from './JwkListPage'
import { Provider } from 'react-redux'
import i18n from '../../../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import moment from 'moment'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { mockJwksConfig } from '../__fixtures__/jwkTestData'
import { DATE_FORMAT } from '../constants'

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

const store = configureStore({
  reducer: combineReducers({
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

describe('JwkListPage', () => {
  it('should render jwks page properly', () => {
    render(<JwkListPage />, {
      wrapper: Wrapper,
    })
    expect(screen.getByText(/JSON Web Keys/)).toBeInTheDocument()
    const firstKey = mockJwksConfig.keys?.[0]
    expect(screen.getByTestId('x5c')).toHaveValue(firstKey?.x5c?.[0] ?? '')
    expect(screen.getByTestId('kid')).toHaveValue(firstKey?.kid ?? '')
    expect(screen.getByTestId('kty')).toHaveValue(firstKey?.kty ?? '')
    expect(screen.getByTestId('use')).toHaveValue(firstKey?.use ?? '')
    expect(screen.getByTestId('alg')).toHaveValue(firstKey?.alg ?? '')
    if (firstKey?.exp != null) {
      expect(screen.getByTestId('exp')).toHaveValue(moment(firstKey.exp).format(DATE_FORMAT))
    }
  })

  it('should handle undefined exp gracefully', () => {
    const { useJwkApi } = require('../hooks')
    useJwkApi.mockReturnValue({
      jwks: {
        keys: [{ ...mockJwksConfig.keys[0], exp: undefined }],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<JwkListPage />, { wrapper: Wrapper })

    expect(screen.getByTestId('exp')).toHaveValue('')
  })

  it('should handle null exp gracefully', () => {
    const { useJwkApi } = require('../hooks')
    useJwkApi.mockReturnValue({
      jwks: {
        keys: [{ ...mockJwksConfig.keys[0], exp: null }],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<JwkListPage />, { wrapper: Wrapper })

    expect(screen.getByTestId('exp')).toHaveValue('')
  })
})
