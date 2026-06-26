import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UploadSSA from '../UploadSSA'
import licenseReducer from '@/redux/features/licenseSlice'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const rootReducer = combineReducers({ licenseReducer })

const buildStore = (licenseState: object = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      licenseReducer: { ...licenseReducer(undefined, { type: '@@i' }), ...licenseState },
    } as never,
  })

const renderUpload = (store = buildStore()) => {
  const dispatchSpy = jest.spyOn(store, 'dispatch')
  const result = render(
    <Provider store={store}>
      <AppTestWrapper>
        <UploadSSA />
      </AppTestWrapper>
    </Provider>,
  )
  return { ...result, dispatchSpy }
}

describe('UploadSSA', () => {
  it('renders the submit button disabled before a file is chosen', () => {
    renderUpload()
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('shows the SSA error message from state', () => {
    renderUpload(buildStore({ errorSSA: 'Invalid SSA. Please contact Gluu.' }))
    expect(screen.getByText('Invalid SSA. Please contact Gluu.')).toBeInTheDocument()
  })

  it('enables submit after a file is read and dispatches uploadNewSsaToken with its contents', async () => {
    const { container, dispatchSpy } = renderUpload()
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['my-jwt-token'], 'ssa.jwt', { type: 'application/jwt' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    const submit = screen.getByRole('button', { name: /submit/i })
    await waitFor(() => expect(submit).toBeEnabled())

    fireEvent.click(submit)

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'license/uploadNewSsaToken',
        payload: { payload: { ssa: 'my-jwt-token' } },
      }),
    )
  })

  it('shows the selected file name in the dropzone', async () => {
    const { container } = renderUpload()
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'my-ssa.jwt', { type: 'application/jwt' })

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => expect(screen.getByText(/my-ssa\.jwt/)).toBeInTheDocument())
  })
})
