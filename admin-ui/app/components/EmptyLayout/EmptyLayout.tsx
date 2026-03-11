import { useEffect, useRef, type ReactNode } from 'react'
import { isNumber } from 'lodash'
import classNames from 'classnames'
import { withPageConfig } from 'Components/Layout'
import type { PageConfig } from 'Components/Layout/types'

interface EmptyLayoutProps {
  pageConfig?: PageConfig | null
  children: ReactNode
  className?: string
}

interface SectionProps {
  className?: string
  children: ReactNode
  center?: boolean
  width?: number | string
}

const EmptyLayoutBase = ({ pageConfig, children, className }: EmptyLayoutProps) => {
  const setVisibilityRef = useRef(pageConfig?.setElementsVisibility)
  setVisibilityRef.current = pageConfig?.setElementsVisibility

  useEffect(() => {
    setVisibilityRef.current?.({
      navbarHidden: true,
      sidebarHidden: true,
      footerHidden: true,
    })

    return () => {
      setVisibilityRef.current?.({
        navbarHidden: false,
        sidebarHidden: false,
        footerHidden: false,
      })
    }
  }, [])

  const emptyLayoutClass = classNames('fullscreen', className)
  return <div className={emptyLayoutClass}>{children}</div>
}

const Section = ({ className, children, center, width = '420px' }: SectionProps) => {
  const sectionClass = classNames(className, 'fullscreen__section', {
    'fullscreen__section--center': center,
  })
  const maxWidth = isNumber(width) ? `${width}px` : width
  return (
    <div className={sectionClass}>
      {center ? (
        <div className="fullscreen__section__child" style={{ maxWidth }}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

const _EmptyLayout = withPageConfig(EmptyLayoutBase)
const EmptyLayout = _EmptyLayout as typeof _EmptyLayout & { Section: typeof Section }
EmptyLayout.Section = Section

export { EmptyLayout }
