import { useState, useEffect } from 'react'
import { getStoredPageTitle, subscribeToPageTitle } from 'Utils/SetTitle'

export const usePageTitle = (initialTitle = 'Dashboard'): string => {
  const [pageTitle, setPageTitle] = useState(() => getStoredPageTitle() || initialTitle)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setPageTitle(getStoredPageTitle() || initialTitle)
    return subscribeToPageTitle((title) => {
      setPageTitle(title || initialTitle)
    })
  }, [initialTitle])

  return pageTitle
}
