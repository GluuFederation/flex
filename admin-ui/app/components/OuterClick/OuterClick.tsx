import React, { ReactNode, useRef, useEffect, useCallback } from 'react'
import some from 'lodash/some'

// Safely gets the browser document object,
// returns a simple mock for server rendering purposes
const getDocument = (): Document | { querySelector: () => null } =>
  typeof document === 'undefined'
    ? {
        querySelector() {
          return null
        },
      }
    : document

/** Event with optional non-standard path (Chrome) */
type DocumentClickEvent = MouseEvent | TouchEvent
type EventWithPath = DocumentClickEvent & { path?: Array<{ id?: string }> }

interface OuterClickProps {
  onClickOutside?: (evt: DocumentClickEvent) => void
  children: ReactNode
  /** Refs to DOM elements; clicks inside these are not considered "outside" */
  excludedElements?: Array<React.RefObject<HTMLElement | null> | null>
  active?: boolean
}

const openSidebar = (path: Array<{ id?: string }> | undefined): boolean => {
  const exists = path?.some((item) => item.id === 'navToggleBtn')
  return !exists
}

export const OuterClick: React.FC<OuterClickProps> = ({
  onClickOutside,
  children,
  excludedElements = [],
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootElementRef = useRef<HTMLElement | null>(null)

  const handleDocumentClick = useCallback(
    (evt: EventWithPath) => {
      if (!openSidebar(evt.path)) return
      if (!active) return

      const domElement = containerRef.current
      const target = evt.target as Node

      const isExcluded = some(excludedElements, (element) => {
        if (!element?.current) return false
        return element.current.contains(target)
      })

      if (!isExcluded && domElement && !domElement.contains(target) && onClickOutside) {
        onClickOutside(evt)
      }
    },
    [active, excludedElements, onClickOutside],
  )

  useEffect(() => {
    const doc = getDocument()
    const root = doc.querySelector('body')
    rootElementRef.current = root as HTMLElement | null

    if (rootElementRef.current) {
      rootElementRef.current.addEventListener('click', handleDocumentClick as EventListener)
      rootElementRef.current.addEventListener('touchstart', handleDocumentClick as EventListener)
    }

    return () => {
      if (rootElementRef.current) {
        rootElementRef.current.removeEventListener('click', handleDocumentClick as EventListener)
        rootElementRef.current.removeEventListener(
          'touchstart',
          handleDocumentClick as EventListener,
        )
      }
    }
  }, [handleDocumentClick])

  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
