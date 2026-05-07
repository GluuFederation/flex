import setTitle, { getStoredPageTitle, subscribeToPageTitle } from '../SetTitle'

const flushMicrotask = async (): Promise<void> => {
  await Promise.resolve()
}

describe('SetTitle', () => {
  beforeEach(() => {
    document.title = ''
    window.__gluuPageTitle = undefined
  })

  it('defers title notifications until after the current render tick', async () => {
    const callback = jest.fn()
    const unsubscribe = subscribeToPageTitle(callback)

    setTitle('SMTP Management')

    expect(callback).not.toHaveBeenCalled()
    expect(getStoredPageTitle()).toBe('Dashboard')

    await flushMicrotask()

    expect(callback).toHaveBeenCalledWith('SMTP Management')
    expect(getStoredPageTitle()).toBe('SMTP Management')
    expect(document.title).toBe('SMTP Management')

    unsubscribe()
  })

  it('coalesces multiple title updates to the latest value', async () => {
    const callback = jest.fn()
    const unsubscribe = subscribeToPageTitle(callback)

    setTitle('First Title')
    setTitle('Second Title')

    await flushMicrotask()

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('Second Title')
    expect(getStoredPageTitle()).toBe('Second Title')

    unsubscribe()
  })
})
