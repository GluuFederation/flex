import { buildPayload } from '@/utils/auditAction'
import type { UserAction, ActionData } from '@/utils/types'

const makeUserAction = (): UserAction => ({ action_message: '', action_data: null })

describe('buildPayload', () => {
  it('sets the action message and data on the user action', () => {
    const userAction = makeUserAction()
    const data: ActionData = { field: 'value' }
    buildPayload(userAction, 'updated client', data)
    expect(userAction.action_message).toBe('updated client')
    expect(userAction.action_data).toBe(data)
  })

  it('overwrites any existing message and data', () => {
    const userAction: UserAction = { action_message: 'old', action_data: { old: true } }
    buildPayload(userAction, 'new', { new: true })
    expect(userAction.action_message).toBe('new')
    expect(userAction.action_data).toEqual({ new: true })
  })

  it('accepts a null payload', () => {
    const userAction = makeUserAction()
    buildPayload(userAction, 'cleared', null)
    expect(userAction.action_data).toBeNull()
  })

  it('accepts an array payload', () => {
    const userAction = makeUserAction()
    buildPayload(userAction, 'list', ['a', 'b'])
    expect(userAction.action_data).toEqual(['a', 'b'])
  })

  it('returns undefined (mutates in place)', () => {
    const userAction = makeUserAction()
    expect(buildPayload(userAction, 'm', null)).toBeUndefined()
  })
})
