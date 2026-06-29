import { renderHook } from '@testing-library/react'
import type { UseMutationResult } from '@tanstack/react-query'
import { useMutationEffects } from 'Plugins/user-claims/hooks/useMutationEffects'

const mockDispatch = jest.fn()
const mockUpdateToast = jest.fn((show: boolean, type: string, message?: string) => ({
  type: 'toast/update',
  payload: { show, type, message },
}))
const mockNavigateBack = jest.fn()

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('Redux/features/toastSlice', () => ({
  updateToast: (show: boolean, type: string, message?: string) =>
    mockUpdateToast(show, type, message),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: mockNavigateBack }),
  ROUTES: { ATTRIBUTES_LIST: '/attributes-list' },
}))

type ErrorLike = Error | { response?: { data?: string | { message?: string } } } | null

type MutationState = {
  isSuccess?: boolean
  isError?: boolean
  error?: ErrorLike
}

const buildMutation = (state: MutationState): UseMutationResult<object, Error, void, void> => {
  const mutationLike = {
    isSuccess: false,
    isError: false,
    error: null,
    ...state,
  }
  return mutationLike as UseMutationResult<object, Error, void, void>
}

const renderEffects = (
  mutation: UseMutationResult<object, Error, void, void>,
  navigateOnSuccess = true,
) =>
  renderHook(() =>
    useMutationEffects({
      mutation,
      successMessage: 'success.key',
      errorMessage: 'error.key',
      navigateOnSuccess,
    }),
  )

describe('user-claims useMutationEffects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('dispatches a success toast and navigates to the attributes list on success', () => {
    renderEffects(buildMutation({ isSuccess: true }))

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'success', 'success.key')
    expect(mockNavigateBack).toHaveBeenCalledWith('/attributes-list')
  })

  it('does not navigate when navigateOnSuccess is false', () => {
    renderEffects(buildMutation({ isSuccess: true }), false)

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'success', 'success.key')
    expect(mockNavigateBack).not.toHaveBeenCalled()
  })

  it('does nothing when the mutation is neither successful nor errored', () => {
    renderEffects(buildMutation({}))

    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockNavigateBack).not.toHaveBeenCalled()
  })

  it('dispatches an error toast using the axios response string', () => {
    renderEffects(buildMutation({ isError: true, error: { response: { data: 'server says no' } } }))

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'server says no')
  })

  it('dispatches an error toast using the axios response message field', () => {
    renderEffects(
      buildMutation({ isError: true, error: { response: { data: { message: 'detailed' } } } }),
    )

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'detailed')
  })

  it('falls back to the Error message when no response data exists', () => {
    renderEffects(buildMutation({ isError: true, error: new Error('boom') }))

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'boom')
  })

  it('falls back to the translated error key when there is no usable message', () => {
    renderEffects(buildMutation({ isError: true, error: {} }))

    expect(mockUpdateToast).toHaveBeenCalledWith(true, 'error', 'error.key')
  })
})
