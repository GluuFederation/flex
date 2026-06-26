import { logAuditAction } from 'Plugins/scripts/components/helper/auditUtils'
import { logger } from '@/utils/logger'
import { createSuccessAuditInit, selectAuditContext } from '@/audit'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getRootState } from '@/redux/hooks'

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn() },
}))

jest.mock('@/audit', () => ({
  createSuccessAuditInit: jest.fn(() => ({ audit: 'init' })),
  selectAuditContext: jest.fn(() => ({ context: true })),
}))

jest.mock('Utils/TokenController', () => ({
  addAdditionalData: jest.fn(),
}))

jest.mock('Redux/api/backend-api', () => ({
  postUserAction: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/redux/hooks', () => ({
  getRootState: jest.fn(() => ({ root: 'state' })),
}))

const mockedCreateInit = createSuccessAuditInit as jest.Mock
const mockedSelectCtx = selectAuditContext as jest.Mock
const mockedAddData = addAdditionalData as jest.Mock
const mockedPost = postUserAction as jest.Mock
const mockedGetRoot = getRootState as jest.Mock
const mockedLoggerError = logger.error as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockedCreateInit.mockReturnValue({ audit: 'init' })
  mockedSelectCtx.mockReturnValue({ context: true })
  mockedGetRoot.mockReturnValue({ root: 'state' })
})

describe('logAuditAction', () => {
  it('builds the audit init from the root state context and posts it', async () => {
    const data = { foo: 'bar' }
    await logAuditAction('CREATE', 'customScript', data)

    expect(mockedGetRoot).toHaveBeenCalledTimes(1)
    expect(mockedSelectCtx).toHaveBeenCalledWith({ root: 'state' })
    expect(mockedCreateInit).toHaveBeenCalledWith({ context: true })
    expect(mockedAddData).toHaveBeenCalledWith({ audit: 'init' }, 'CREATE', 'customScript', data)
    expect(mockedPost).toHaveBeenCalledWith({ audit: 'init' })
  })

  it('logs an error when postUserAction rejects with an Error', async () => {
    const err = new Error('network down')
    mockedPost.mockRejectedValueOnce(err)

    await logAuditAction('DELETE', 'res', {})

    expect(mockedLoggerError).toHaveBeenCalledWith('Audit logging failed for DELETE:', err)
  })

  it('coerces non-Error rejections to a string when logging', async () => {
    mockedPost.mockRejectedValueOnce('boom')

    await logAuditAction('UPDATE', 'res', {})

    expect(mockedLoggerError).toHaveBeenCalledWith('Audit logging failed for UPDATE:', 'boom')
  })
})
