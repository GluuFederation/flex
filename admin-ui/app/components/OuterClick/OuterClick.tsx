import React, { ReactNode, useRef, useEffect, useCallback } from 'react'
import some from 'lodash/some'

const getDocument = (): Document | { querySelector: () => null } =>
  typeof document === 'undefined'
    ? {
        querySelector() {
          return null
        },
      }
    : document

type DocumentClickEvent = MouseEvent | TouchEvent

interface OuterClickProps {
  onClickOutside?: (evt: DocumentClickEvent) => void
  children: ReactNode

  excludedElements?: Array<React.RefObject<HTMLElement | null> | null>
  active?: boolean
}

const getEventPath = (evt: DocumentClickEvent): Array<EventTarget | null> => {
  if ('composedPath' in evt && typeof evt.composedPath === 'function') {
    return evt.composedPath()
  }
  return (evt as DocumentClickEvent & { path?: Array<EventTarget | null> }).path ?? []
}

const isNavToggleClick = (evt: DocumentClickEvent): boolean =>
  getEventPath(evt).some((node) => (node as HTMLElement | null)?.id === 'navToggleBtn')

export const OuterClick: React.FC<OuterClickProps> = ({
  onClickOutside,
  children,
  excludedElements = [],
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootElementRef = useRef<HTMLElement | null>(null)
  const excludedElementsRef = useRef(excludedElements)
  excludedElementsRef.current = excludedElements

  const handleDocumentClick = useCallback(
    (evt: DocumentClickEvent) => {
      if (isNavToggleClick(evt)) return
      if (!active) return

      const domElement = containerRef.current
      const target = evt.target as Node
      const elements = excludedElementsRef.current

      const isExcluded = some(elements, (element) => {
        if (!element?.current) return false
        return element.current.contains(target)
      })

      if (!isExcluded && domElement && !domElement.contains(target) && onClickOutside) {
        onClickOutside(evt)
      }
    },
    [active, onClickOutside],
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
