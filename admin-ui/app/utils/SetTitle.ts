type TitleChangeEvent = CustomEvent<string>

declare global {
  interface Window {
    __gluuPageTitle?: string
  }
}

const TITLE_CHANGE_EVENT = 'gluu-page-title-change'
const DEFAULT_TITLE = 'Dashboard'
let queuedTitle: string | null = null
let isFlushQueued = false

const normalizeTitle = (title?: string | null): string => {
  const trimmed = (title ?? '').trim()
  return trimmed
}

const applyTitleToDom = (title: string): void => {
  if (typeof window === 'undefined') return

  const pageTitleNavbar = document.getElementById('page-title-navbar')
  if (pageTitleNavbar) {
    pageTitleNavbar.textContent = title
  }
}

const flushTitleUpdate = (): void => {
  isFlushQueued = false

  if (typeof window === 'undefined') return

  const normalizedTitle = queuedTitle
  queuedTitle = null

  if (!normalizedTitle) {
    return
  }

  window.__gluuPageTitle = normalizedTitle
  document.title = normalizedTitle
  applyTitleToDom(normalizedTitle)
  window.dispatchEvent(new CustomEvent<string>(TITLE_CHANGE_EVENT, { detail: normalizedTitle }))
}

const queueTitleUpdate = (): void => {
  if (typeof window === 'undefined' || isFlushQueued) return

  isFlushQueued = true

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(flushTitleUpdate)
    return
  }

  Promise.resolve().then(flushTitleUpdate)
}

const setTitle = (title: string = DEFAULT_TITLE) => {
  if (typeof window === 'undefined') return

  const normalizedTitle = normalizeTitle(title)
  if (!normalizedTitle) {
    return
  }

  queuedTitle = normalizedTitle
  queueTitleUpdate()
}

export const getStoredPageTitle = (): string => {
  if (typeof window === 'undefined') return DEFAULT_TITLE
  return normalizeTitle(window.__gluuPageTitle) || DEFAULT_TITLE
}

export const subscribeToPageTitle = (callback: (title: string) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {}

  const handler = (event: Event) => {
    const customEvent = event as TitleChangeEvent
    const nextTitle = normalizeTitle(customEvent.detail) || getStoredPageTitle()
    applyTitleToDom(nextTitle)
    callback(nextTitle)
  }

  window.addEventListener(TITLE_CHANGE_EVENT, handler)
  return () => window.removeEventListener(TITLE_CHANGE_EVENT, handler)
}

export default setTitle
