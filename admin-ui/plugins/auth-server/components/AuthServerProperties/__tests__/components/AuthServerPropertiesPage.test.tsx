import React from 'react'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import AuthServerPropertiesPage from '../..'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  fetchAuthServerJsonProperties,
  patchAuthServerJsonProperties,
} from 'Plugins/auth-server/services/jsonPropertiesService'
import { mockAuthServerJsonProperties as config } from '../authServerPropertiesTestData'
import { SIMPLE_PASSWORD_AUTH } from '@/constants'

const mockListFieldRender = jest.fn()
const mockPutAcrs = jest.fn()
jest.mock('Routes/Apps/Gluu/GluuAutocomplete', () => {
  const actual = jest.requireActual('Routes/Apps/Gluu/GluuAutocomplete')
  return {
    __esModule: true,
    default: (props: { name: string }) => {
      mockListFieldRender(props.name)
      return actual.default(props)
    },
  }
})

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: ({ modal, onAccept }: { modal: boolean; onAccept: (message: string) => void }) =>
    modal ? (
      <button type="button" onClick={() => onAccept('test commit message')}>
        Accept
      </button>
    ) : null,
}))

jest.mock('JansConfigApi', () => ({
  ...jest.requireActual('JansConfigApi'),
  useGetAcrs: () => ({ data: { defaultAcr: 'simple' }, isLoading: false }),
  usePutAcrs: () => ({ mutateAsync: mockPutAcrs, isPending: false }),
  getGetAcrsQueryKey: () => ['acrs'],
  useGetConfigScripts: () => ({ data: { entries: [] }, isSuccess: false }),
}))

jest.mock('Plugins/auth-server/services/jsonPropertiesService', () => {
  const { mockAuthServerJsonProperties } = jest.requireActual<
    typeof import('../authServerPropertiesTestData')
  >('../authServerPropertiesTestData')
  return {
    fetchAuthServerJsonProperties: jest.fn(() => Promise.resolve(mockAuthServerJsonProperties)),
    patchAuthServerJsonProperties: jest.fn(),
  }
})

jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    AuthenticationServerConfiguration: 'AuthenticationServerConfiguration',
  },
  CEDAR_RESOURCE_SCOPES: { AuthenticationServerConfiguration: [] },
}))

jest.mock('../../../Authentication/Acrs/hooks', () => ({
  useAcrAudit: () => ({
    logAcrUpdate: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: jest.fn() }),
  ROUTES: {
    HOME_DASHBOARD: '/home',
    PLUGIN_BASE_PATHS: { HOME: '/home', AUTH_SERVER: '/auth-server', USER_MANAGEMENT: '/users' },
  },
}))

const clientPermissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]

const ACER_STATE = {
  acrReponse: {},
}

const INIT_REDUCER_STATE = {
  isSessionExpired: false,
}

const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: clientPermissions,
  location: {},
  config: {},
  backendIsUp: true,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    noReducer: (state = {}) => state,
    acrReducer: (state = ACER_STATE) => state,
    initReducer: (state = INIT_REDUCER_STATE) => state,
    cedarPermissions: (
      state = { permissions: {}, loading: false, error: null, initialized: true },
    ) => state,
    webhookReducer: (state = { loadingWebhooks: false, webhookModal: false }) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  </AppTestWrapper>
)

it('Should render json properties page properly', async () => {
  render(<AuthServerPropertiesPage />, {
    wrapper: Wrapper,
  })
  await waitFor(() => {
    expect(screen.getByTestId('issuer')).toHaveValue(config.issuer)
  })
  expect(screen.getByTestId('baseEndpoint')).toHaveValue(config.baseEndpoint)
  expect(screen.getByTestId('authorizationEndpoint')).toHaveValue(config.authorizationEndpoint)
})

const PAGE_WAIT = { timeout: 10000 }
const PAGE_TEST_TIMEOUT = 30000
const PILL_IN_LAST_SECTION = 'region'

const renderPage = async () => {
  render(<AuthServerPropertiesPage />, { wrapper: Wrapper })
  await waitFor(() => {
    expect(screen.getByTestId('issuer')).toHaveValue(config.issuer)
    expect(screen.getByTitle(PILL_IN_LAST_SECTION)).toBeInTheDocument()
  }, PAGE_WAIT)
}

const getFieldCard = (label: string): HTMLElement => {
  const header = screen.getByText(
    (_, element) => element?.textContent?.trim() === `${label}:` && element.tagName === 'DIV',
  )
  return header.parentElement as HTMLElement
}

const getPill = (card: HTMLElement, value: string) => within(card).queryByTitle(value)

describe('Grant Types Supported', () => {
  it('offers every grant type the API defines, including implicit', async () => {
    await renderPage()
    const card = getFieldCard('Grant Types Supported')

    fireEvent.mouseDown(within(card).getByRole('combobox'))
    const listbox = within(card).getByRole('listbox')

    expect(within(listbox).getByText('implicit')).toBeInTheDocument()
    expect(within(listbox).getByText('password')).toBeInTheDocument()
    expect(within(listbox).getByText('urn:openid:params:grant-type:ciba')).toBeInTheDocument()
    expect(within(listbox).queryByText('none')).not.toBeInTheDocument()
  })

  it('shows implicit as a pill after it is picked from the dropdown', async () => {
    await renderPage()
    const card = getFieldCard('Grant Types Supported')

    fireEvent.mouseDown(within(card).getByRole('combobox'))
    fireEvent.click(within(within(card).getByRole('listbox')).getByText('implicit'))

    expect(getPill(card, 'implicit')).toBeInTheDocument()
    expect(getPill(card, 'authorization_code')).toBeInTheDocument()
  })

  it('removes the pill when its remove button is clicked', async () => {
    await renderPage()
    const card = getFieldCard('Grant Types Supported')
    const pill = getPill(card, 'refresh_token') as HTMLElement

    fireEvent.click(within(pill).getByRole('button'))

    expect(getPill(card, 'refresh_token')).not.toBeInTheDocument()
    expect(getPill(card, 'authorization_code')).toBeInTheDocument()
  })
})

describe('Response Types Supported', () => {
  const getSection = (): HTMLElement => {
    const header = screen.getByText('Response Types Supported')
    return header.closest('.accordion, .card') as HTMLElement
  }

  it('offers token although no row has it yet', async () => {
    await renderPage()
    const [firstRow] = within(getSection()).getAllByRole('combobox')

    fireEvent.mouseDown(firstRow)

    expect(screen.getByRole('option', { name: /^token$/ })).toBeInTheDocument()
  })

  it('removes a pill from a row when its remove button is clicked', async () => {
    await renderPage()
    const section = getSection()

    fireEvent.click(within(within(section).getByTitle('id_token')).getByRole('button'))

    expect(within(section).queryByTitle('id_token')).not.toBeInTheDocument()
    expect(within(section).getAllByTitle('code')).toHaveLength(2)
  })
})

describe('Logging Level', () => {
  it('shows the newly selected level instead of the loaded one', async () => {
    await renderPage()
    const select = screen.getByTestId('loggingLevel')
    expect(select).toHaveValue(config.loggingLevel)

    fireEvent.change(select, { target: { value: 'DEBUG' } })

    expect(screen.getByTestId('loggingLevel')).toHaveValue('DEBUG')
  })
})

const fieldOf = (element: HTMLElement): HTMLElement => {
  let current: HTMLElement | null = element
  while (current && !current.querySelector('[role="combobox"]')) current = current.parentElement
  return current as HTMLElement
}

const removePillAndOpenDropdown = (title: string): HTMLElement => {
  const field = fieldOf(screen.getByTitle(title))
  fireEvent.click(within(within(field).getByTitle(title)).getByRole('button'))
  fireEvent.mouseDown(within(field).getByRole('combobox'))
  return field
}

describe('a removed value can be picked again', () => {
  it.each([
    ['a top-level list', 'bg'],
    ['a list inside an object', 'region'],
    ['a list with fixed options', 'refresh_token'],
    ['a nested row list', 'id_token'],
  ])('in %s', async (_case, value) => {
    await renderPage()

    const field = removePillAndOpenDropdown(value)
    expect(within(field).queryByTitle(value)).not.toBeInTheDocument()

    fireEvent.click(within(within(field).getByRole('listbox')).getByText(value))

    expect(within(field).getByTitle(value)).toBeInTheDocument()
  })
})

describe('Cancel', () => {
  it.each([['bg'], ['region'], ['refresh_token'], ['id_token']])(
    'brings back a removed %s pill',
    async (value) => {
      await renderPage()
      const field = fieldOf(screen.getByTitle(value))
      fireEvent.click(within(within(field).getByTitle(value)).getByRole('button'))
      expect(screen.queryByTitle(value)).not.toBeInTheDocument()

      fireEvent.click(screen.getByText('Cancel'))

      expect(await screen.findByTitle(value, {}, PAGE_WAIT)).toBeInTheDocument()
    },
  )

  it('restores the loaded logging level', async () => {
    await renderPage()
    fireEvent.change(screen.getByTestId('loggingLevel'), { target: { value: 'DEBUG' } })

    fireEvent.click(screen.getByText('Cancel'))

    await waitFor(
      () => expect(screen.getByTestId('loggingLevel')).toHaveValue(config.loggingLevel),
      PAGE_WAIT,
    )
  })
})

describe('typing in a text field', () => {
  it('does not re-render any list field', async () => {
    await renderPage()
    mockListFieldRender.mockClear()

    fireEvent.change(screen.getByTestId('issuer'), { target: { value: 'https://edited.example' } })

    expect(screen.getByTestId('issuer')).toHaveValue('https://edited.example')
    expect(mockListFieldRender).not.toHaveBeenCalled()
  })
})

const probeRenders = jest.fn()
const TranslatedProbe = () => {
  useTranslation()
  probeRenders()
  return null
}
const MemoizedProbe = React.memo(TranslatedProbe)

describe('field labels missing from the translations', () => {
  afterEach(() => queryClient.clear())

  it('are added without re-rendering other translated components', async () => {
    queryClient.clear()
    jest.mocked(fetchAuthServerJsonProperties).mockResolvedValueOnce({
      zzPageLabelProbe: 'probe',
      zzPageLabelProbeGroup: { zzPageLabelProbeNested: true },
    })
    render(
      <>
        <MemoizedProbe />
        <AuthServerPropertiesPage />
      </>,
      { wrapper: Wrapper },
    )
    probeRenders.mockClear()

    await waitFor(() => expect(screen.getByText(/Zz Page Label Probe Nested/)).toBeInTheDocument())
    expect(screen.getByTestId('zzPageLabelProbe')).toHaveValue('probe')
    expect(probeRenders).not.toHaveBeenCalled()
  })
})

describe('opening the page', () => {
  it(
    'shows the endpoint fields before rendering the rest of the form',
    async () => {
      const commits: Array<{ endpointsShown: boolean; restShown: boolean }> = []
      const recordCommit = () => {
        const issuer = document.querySelector<HTMLInputElement>('[data-testid="issuer"]')
        commits.push({
          endpointsShown: issuer?.value === config.issuer,
          restShown: document.querySelector('[data-testid="loggingLevel"]') !== null,
        })
      }
      render(
        <React.Profiler id="auth-server-properties" onRender={recordCommit}>
          <AuthServerPropertiesPage />
        </React.Profiler>,
        { wrapper: Wrapper },
      )

      await waitFor(() => expect(screen.getByTestId('loggingLevel')).toBeInTheDocument(), PAGE_WAIT)
      expect(commits.some((commit) => commit.endpointsShown && !commit.restShown)).toBe(true)
    },
    PAGE_TEST_TIMEOUT,
  )
})

describe('Default ACR', () => {
  it(
    'keeps the picked value while a search adds rows to the form',
    async () => {
      await renderPage()
      fireEvent.change(await screen.findByTestId('defaultAcr', {}, PAGE_WAIT), {
        target: { value: SIMPLE_PASSWORD_AUTH },
      })
      expect(screen.getByTestId('defaultAcr')).toHaveValue(SIMPLE_PASSWORD_AUTH)

      const search = screen.getByPlaceholderText('Search pattern')
      fireEvent.change(search, { target: { value: 'e' } })
      fireEvent.keyDown(search, { key: 'Enter' })
      await waitFor(() => expect(screen.queryByTestId('oxId')).not.toBeInTheDocument(), PAGE_WAIT)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
      })

      expect(screen.getByTestId('defaultAcr')).toHaveValue(SIMPLE_PASSWORD_AUTH)
    },
    PAGE_TEST_TIMEOUT,
  )
})

describe('saving', () => {
  beforeEach(() => {
    jest.mocked(patchAuthServerJsonProperties).mockClear()
    mockPutAcrs.mockClear()
  })

  const confirmApply = async () => {
    fireEvent.click(screen.getByText('Apply'))
    fireEvent.click(await screen.findByText('Accept', {}, PAGE_WAIT))
  }

  it(
    'sends nothing before Apply is confirmed',
    async () => {
      await renderPage()
      fireEvent.change(screen.getByTestId('issuer'), {
        target: { value: 'https://edited.example' },
      })
      fireEvent.change(screen.getByTestId('loggingLevel'), { target: { value: 'DEBUG' } })
      fireEvent.change(screen.getByTestId('defaultAcr'), {
        target: { value: SIMPLE_PASSWORD_AUTH },
      })
      fireEvent.click(within(screen.getByTitle('refresh_token')).getByRole('button'))

      fireEvent.click(screen.getByText('Apply'))
      expect(await screen.findByText('Accept', {}, PAGE_WAIT)).toBeInTheDocument()

      expect(patchAuthServerJsonProperties).not.toHaveBeenCalled()
      expect(mockPutAcrs).not.toHaveBeenCalled()
    },
    PAGE_TEST_TIMEOUT,
  )

  it(
    'sends the changed fields once Apply is confirmed',
    async () => {
      await renderPage()
      fireEvent.change(screen.getByTestId('issuer'), {
        target: { value: 'https://edited.example' },
      })
      fireEvent.change(screen.getByTestId('loggingLevel'), { target: { value: 'DEBUG' } })

      await confirmApply()

      await waitFor(() => expect(patchAuthServerJsonProperties).toHaveBeenCalledTimes(1), PAGE_WAIT)
      expect(patchAuthServerJsonProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          action_data: expect.objectContaining({
            requestBody: [
              { op: 'replace', path: '/issuer', value: 'https://edited.example' },
              { op: 'replace', path: '/loggingLevel', value: 'DEBUG' },
            ],
          }),
        }),
      )
    },
    PAGE_TEST_TIMEOUT,
  )

  it(
    'sends the default ACR once Apply is confirmed',
    async () => {
      await renderPage()
      fireEvent.change(screen.getByTestId('defaultAcr'), {
        target: { value: SIMPLE_PASSWORD_AUTH },
      })

      await confirmApply()

      await waitFor(() => expect(mockPutAcrs).toHaveBeenCalledTimes(1), PAGE_WAIT)
      expect(mockPutAcrs).toHaveBeenCalledWith({ data: { defaultAcr: SIMPLE_PASSWORD_AUTH } })
      expect(patchAuthServerJsonProperties).not.toHaveBeenCalled()
    },
    PAGE_TEST_TIMEOUT,
  )
})
