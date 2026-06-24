import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JsonViewerDialog from 'Plugins/auth-server/components/JsonViewer/components/JsonViewerDialog'

const createStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession: true }) => state,
      toastReducer: (
        state = { showToast: false, message: '', type: 'success', onCloseRedirectUrl: '' },
        action: { type: string; payload?: { message?: string; type?: string } },
      ) => {
        if (action.type === 'toast/updateToast') {
          return { ...state, showToast: true, ...action.payload }
        }
        return state
      },
      noReducer: (state = {}) => state,
    }),
  })

type DialogProps = React.ComponentProps<typeof JsonViewerDialog>

const renderDialog = (props: Partial<DialogProps> = {}) => {
  const toggle = props.toggle ?? jest.fn()
  const store = createStore()
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  )
  const utils = render(
    <JsonViewerDialog isOpen toggle={toggle} data={{ foo: 'bar' }} {...props} />,
    { wrapper: Wrapper },
  )
  return { ...utils, toggle, store }
}

describe('JsonViewerDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    })
  })

  it('does not render when isOpen is false', () => {
    const toggle = jest.fn()
    const store = createStore()
    const { container } = render(
      <AppTestWrapper>
        <Provider store={store}>
          <JsonViewerDialog isOpen={false} toggle={toggle} data={{ foo: 'bar' }} />
        </Provider>
      </AppTestWrapper>,
    )
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
  })

  it('renders the dialog with the default title when open', () => {
    renderDialog()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('JSON View')).toBeInTheDocument()
  })

  it('renders a custom title', () => {
    renderDialog({ title: 'SSA Details' })
    expect(screen.getByText('SSA Details')).toBeInTheDocument()
  })

  it('renders the copy-to-clipboard button', () => {
    renderDialog()
    expect(screen.getByText(/Copy To Clipboard/i)).toBeInTheDocument()
  })

  it('copies data to the clipboard and switches the label to Copied', async () => {
    renderDialog({ data: { hello: 'world' } })
    const copyBtn = screen.getByText(/Copy To Clipboard/i)
    await act(async () => {
      fireEvent.click(copyBtn)
    })
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify({ hello: 'world' }, null, 2),
      )
    })
    await waitFor(() => {
      expect(screen.getByText(/Copied/i)).toBeInTheDocument()
    })
  })

  it('copies a string payload as-is', async () => {
    renderDialog({ data: 'plain-string' })
    await act(async () => {
      fireEvent.click(screen.getByText(/Copy To Clipboard/i))
    })
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('plain-string')
    })
  })

  it('dispatches an error toast when clipboard copy fails', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error('denied')) },
    })
    const { store } = renderDialog({ data: { a: 1 } })
    await act(async () => {
      fireEvent.click(screen.getByText(/Copy To Clipboard/i))
    })
    await waitFor(() => {
      expect(store.getState().toastReducer.showToast).toBe(true)
    })
  })

  it('calls toggle when the close button is clicked', () => {
    const { toggle } = renderDialog()
    fireEvent.click(screen.getByTitle('Close'))
    expect(toggle).toHaveBeenCalled()
  })

  it('disables the copy button when data is undefined', () => {
    renderDialog({ data: undefined })
    const copyBtn = screen.getByText(/Copy To Clipboard/i).closest('button')
    expect(copyBtn).toBeDisabled()
  })
})
