import { devLogger } from '@/utils/devLogger'
import { fetchApiTokenWithDefaultScopes } from 'Redux/api/backend-api'

type TestGlobal = {
  issuer?: string
  token?: string
}

const getTestGlobal = (): TestGlobal => globalThis as TestGlobal & typeof globalThis

export const beforeAllAsync = async (
  formInitState: (token: string, issuer: string) => void,
): Promise<void> => {
  const g = getTestGlobal()
  if (!g.issuer && !g.token) {
    try {
      const accessToken = await fetchApiTokenWithDefaultScopes()
      g.token = accessToken.access_token
      formInitState(accessToken.access_token, '')
    } catch (error) {
      formInitState(g.token ?? '', g.issuer ?? '')
      const message = error instanceof Error ? error.message : String(error)
      devLogger.error(message)
      throw new Error('Error during beforeAllAsync: ' + message, { cause: error })
    }
  } else {
    devLogger.log('Issuer and token already available.')
  }
}

export const authReducerInit = (token: string, issuer: string) => {
  return {
    userinfo_jwt: token,
    config: {
      clientId: '',
      authServerHost: 'https://admin-ui-test.gluu.org',
    },
    location: {
      IPv4: '',
    },
    userinfo: {},
    issuer,
    token: {
      access_token: token,
    },
  }
}
