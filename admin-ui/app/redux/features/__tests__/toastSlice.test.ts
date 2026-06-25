import reducer, { updateToast } from '../toastSlice'

const getInitial = () => reducer(undefined, { type: '@@INIT' })

describe('toastSlice', () => {
  it('returns the initial state', () => {
    expect(getInitial()).toEqual({
      showToast: false,
      message: '',
      type: 'success',
      onCloseRedirectUrl: '',
    })
  })

  it('updateToast action creator builds the toast/updateToast action with defaults', () => {
    expect(updateToast()).toEqual({
      type: 'toast/updateToast',
      payload: { showToast: false, message: '', type: 'success', onCloseRedirectUrl: '' },
    })
  })

  it('updateToast action creator forwards provided values', () => {
    expect(updateToast(true, 'error', 'oops', '/home')).toEqual({
      type: 'toast/updateToast',
      payload: { showToast: true, message: 'oops', type: 'error', onCloseRedirectUrl: '/home' },
    })
  })

  it('reducer applies an updateToast action to state', () => {
    const state = reducer(getInitial(), updateToast(true, 'warning', 'careful'))
    expect(state).toEqual({
      showToast: true,
      type: 'warning',
      message: 'careful',
      onCloseRedirectUrl: '',
    })
  })

  it('reducer defaults onCloseRedirectUrl to empty string when omitted', () => {
    const state = reducer(getInitial(), {
      type: 'toast/updateToast',
      payload: { showToast: true, type: 'info', message: 'hi' },
    })
    expect(state.onCloseRedirectUrl).toBe('')
  })
})
