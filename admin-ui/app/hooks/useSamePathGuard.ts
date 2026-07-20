import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import type { MouseEvent } from 'react'

const useSamePathGuard = (path: string) => {
  const { pathname } = useLocation()

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (pathname === path) {
        event.preventDefault()
      }
    },
    [pathname, path],
  )
}

export { useSamePathGuard }
