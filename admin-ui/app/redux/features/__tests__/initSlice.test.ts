import { reducer } from '../initSlice'
import { handleApiTimeout } from '../initSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('initSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({ isTimeout: false })
  })

  it('handleApiTimeout sets isTimeout from the payload', () => {
    expect(reducer(getInitial(), handleApiTimeout({ isTimeout: true })).isTimeout).toBe(true)
    expect(reducer(getInitial(), handleApiTimeout({ isTimeout: false })).isTimeout).toBe(false)
  })
})
