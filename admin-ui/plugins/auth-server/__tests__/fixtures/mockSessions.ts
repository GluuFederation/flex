import type { Session } from '../../components/Sessions/types'

export const mockSessions: Session[] = [
  {
    id: 'session-001',
    userDn: 'inum=baea0439-d11f-4fd7-a349-b9cd80fda871,ou=people,o=jans',
    authenticationTime: '2026-01-15T15:45:12.000Z',
    state: 'authenticated',
    sessionState:
      '5383a40a202d8c8df1572ab0f17d1064214ae8d3392942827ef031b91ed3b378.88fb1116-f2a8-4092-9980-e3bf136cbbc1',
    sessionAttributes: {
      auth_user: 'admin',
      remote_ip: '39.37.143.207',
      client_id: '2001.5fabc237-75e1-49fe-a496-b0c8589835bd',
      acr_values: 'basic',
      sid: '82720034-ed55-4476-a1f8-2f8cc6c6e2a8',
      acr: 'basic',
      opbs: '53a408e9-016f-49a9-b263-9a0ae8cd4b3f',
      scope: 'openid https://jans.io/auth/ssa.admin email profile offline_access jans_stat',
      state: 'IoSANBOzSm',
      auth_step: '1',
      redirect_uri: 'https://admin-ui-test.gluu.org/admin',
      response_type: 'code',
    },
    expirationDate: '2026-01-16T00:00:00.000Z',
    permissionGrantedMap: {
      '2001.5fabc237-75e1-49fe-a496-b0c8589835bd': true,
    },
  },
  {
    id: 'session-002',
    userDn: 'inum=c4f2e891-22ab-4c3d-9e11-7a8b1c2d3e4f,ou=people,o=jans',
    authenticationTime: '2026-01-15T15:45:12.000Z',
    state: 'authenticated',
    sessionState:
      '7912b50c303e9d4ef2683bc1g28e2175325bf4d4503053938fg142c02fe4c489.99gc2227-g3b9-5193-0091-f4cg247dccd2',
    sessionAttributes: {
      auth_user: 'testuser',
      remote_ip: '192.168.1.100',
      client_id: '2001.5fabc237-75e1-49fe-a496-b0c8589835bd',
      acr_values: 'basic',
      sid: '93831145-fe66-5587-b2g9-3g9dd7d7f3b9',
    },
    expirationDate: '2026-01-16T00:00:00.000Z',
    permissionGrantedMap: {
      '2001.5fabc237-75e1-49fe-a496-b0c8589835bd': true,
    },
  },
]

export default mockSessions
