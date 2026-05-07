declare global {
  interface Window {
    __gluuPageTitle?: string
  }
}

const TITLE_CHANGE_EVENT = 'gluu-page-title-change'
const DEFAULT_TITLE = 'Dashboard'

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

const setTitle = (title: string = DEFAULT_TITLE) => {
  if (typeof window === 'undefined') return

  const normalizedTitle = normalizeTitle(title)
  if (!normalizedTitle) {
    return
  }

  window.__gluuPageTitle = normalizedTitle
  document.title = normalizedTitle

  applyTitleToDom(normalizedTitle)
  window.dispatchEvent(new CustomEvent(TITLE_CHANGE_EVENT, { detail: normalizedTitle }))
}

export const getStoredPageTitle = (): string => {
  if (typeof window === 'undefined') return DEFAULT_TITLE
  return normalizeTitle(window.__gluuPageTitle) || DEFAULT_TITLE
}

export const subscribeToPageTitle = (callback: (title: string) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {}

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<string>
    const nextTitle = normalizeTitle(customEvent.detail) || getStoredPageTitle()
    applyTitleToDom(nextTitle)
    callback(nextTitle)
  }

  window.addEventListener(TITLE_CHANGE_EVENT, handler)
  return () => window.removeEventListener(TITLE_CHANGE_EVENT, handler)
}

export default setTitle
