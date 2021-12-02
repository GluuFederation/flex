import React from 'react'
import { render, screen } from '@testing-library/react'
import MonthlyActiveUsersPage from './MonthlyActiveUsersPage'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const stat = [
  {
      "month": 202108,
      "monthly_active_users": 5,
      "token_count_per_granttype": {
          "client_credentials": {
              "access_token": 107
          },
          "authorization_code": {
              "access_token": 623,
              "id_token": 622
          }
      }
  },
  {
      "month": 202109,
      "monthly_active_users": 1,
      "token_count_per_granttype": {
          "client_credentials": {
              "access_token": 957
          },
          "authorization_code": {
              "access_token": 2387,
              "id_token": 2387
          }
      }
  },
  {
      "month": 202110,
      "monthly_active_users": 1,
      "token_count_per_granttype": {
          "client_credentials": {
              "access_token": 89
          },
          "authorization_code": {
              "access_token": 350,
              "id_token": 350
          }
      }
  },
  {
      "month": 202111,
      "monthly_active_users": 1,
      "token_count_per_granttype": {
          "client_credentials": {
              "access_token": 1036
          },
          "password": {
              "access_token": 2
          },
          "authorization_code": {
              "access_token": 347,
              "id_token": 347
          }
      }
  },
  {
      "month": 202112,
      "monthly_active_users": 1,
      "token_count_per_granttype": {
          "client_credentials": {
              "access_token": 411
          },
          "authorization_code": {
              "access_token": 132,
              "id_token": 132
          }
      }
  }
]

const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}
const INIT_MAU_STATE = {
  stat: stat,
}
const INIT_OIDC_STATE = {
  loading: false,
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    mauReducer: (state = INIT_MAU_STATE) => state,
    oidcReducer: (state = INIT_OIDC_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the api role list page properly', () => {
  render(<MonthlyActiveUsersPage />, { wrapper: Wrapper })
})
