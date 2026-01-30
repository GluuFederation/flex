import { useState, useEffect } from 'react'

export function usePageTitle(initialTitle = 'Dashboard'): string {
  const [pageTitle, setPageTitle] = useState(initialTitle)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const titleElement = document.getElementById('page-title')
    if (!titleElement) return

    setPageTitle(titleElement.textContent || initialTitle)

    const observer = new MutationObserver(() => {
      setPageTitle(titleElement.textContent || initialTitle)
    })

    observer.observe(titleElement, { childList: true, characterData: true, subtree: true })

    return () => observer.disconnect()
  }, [initialTitle])

  return pageTitle
}
