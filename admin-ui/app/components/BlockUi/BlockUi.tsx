import React, { useState, useRef, useEffect } from 'react'

interface BlockUiProps {
  tag?: keyof JSX.IntrinsicElements
  blocking?: boolean
  className?: string
  children?: React.ReactNode
  message?: string
  loader?: React.ComponentType
  renderChildren?: boolean
  keepInView?: boolean
  ariaLabel?: string
}

const DefaultLoader = () => {
  return (
    <div className="loading-indicator">
      <span className="loading-bullet">&bull;</span>
      <span className="loading-bullet">&bull;</span>
      <span className="loading-bullet">&bull;</span>
    </div>
  )
}
const safeActiveElement = (doc?: Document): Element => {
  const targetDoc = doc ?? document
  let activeElement: Element

  try {
    activeElement = targetDoc.activeElement ?? targetDoc.body
    if (!activeElement?.nodeName) {
      activeElement = targetDoc.body
    }
  } catch {
    activeElement = targetDoc.body
  }

  return activeElement
}

export default function BlockUi(props: BlockUiProps) {
  const {
    tag: Tag = 'div',
    blocking,
    className,
    children,
    message,
    loader: Loader = DefaultLoader,
    renderChildren = true,
    keepInView,
    ariaLabel = 'loading',
    ...attributes
  } = props

  const classes = blocking ? `block-ui ${className}` : className
  const renderChilds = !blocking || renderChildren

  const [top] = useState<string>('50%')
  const [focused, setFocused] = useState<Element | null>(null)

  const helper = useRef<HTMLSpanElement>(null)
  const blocker = useRef<HTMLDivElement>(null)
  const topFocus = useRef<HTMLDivElement>(null)
  const bottomFocus = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const messageContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (blocking) {
      if (
        helper.current &&
        helper.current.parentNode &&
        helper.current.parentNode.contains &&
        helper.current.parentNode.contains(safeActiveElement())
      ) {
        setFocused(safeActiveElement())
        if (focused && focused !== document.body) {
          const scheduleBlur = window.setImmediate || setTimeout
          scheduleBlur(
            () =>
              focused &&
              'blur' in focused &&
              typeof (focused as HTMLElement).blur === 'function' &&
              (focused as HTMLElement).blur(),
          )
        }
      }
    } else {
      detachListeners()
      const ae = safeActiveElement()
      if (focused && (!ae || ae === document.body || ae === topFocus.current)) {
        if ('focus' in focused && typeof (focused as HTMLElement).focus === 'function') {
          const el = focused as HTMLElement
          el.focus()
        }
        setFocused(null)
      }
    }
    if (
      keepInView &&
      (keepInView !== props.keepInView || (blocking && blocking !== props.blocking))
    ) {
      attachListeners()
      keepInViewFunc()
    }
    return () => {
      detachListeners()
    }
  }, [blocking, keepInView, focused])

  const blockingTab = (e: React.KeyboardEvent, withShift = false) => {
    return blocking && (e.key === 'Tab' || e.keyCode === 9) && e.shiftKey === withShift
  }

  const tabbedUpTop = (e: React.KeyboardEvent) => {
    if (blockingTab(e)) {
      blocker.current?.focus()
    }
  }

  const tabbedDownTop = (e: React.KeyboardEvent) => {
    if (blockingTab(e)) {
      e.preventDefault()
      blocker.current?.focus()
    }
  }

  const tabbedUpBottomFocus = (e: React.KeyboardEvent) => {
    if (blockingTab(e)) {
      e.preventDefault()
      topFocus.current?.focus()
    }
  }

  const tabbedDownBottomFocus = (e: React.KeyboardEvent) => {
    if (blockingTab(e)) {
      e.preventDefault()
      topFocus.current?.focus()
    }
  }

  const tabbedUpBottom = (e: React.KeyboardEvent) => {
    if (blockingTab(e, true)) {
      topFocus.current?.focus()
    }
  }

  const tabbedDownBottom = (e: React.KeyboardEvent) => {
    if (blockingTab(e, true)) {
      e.preventDefault()
      topFocus.current?.focus()
    }
  }

  const attachListeners = () => {
    window.addEventListener('scroll', handleScroll)
  }

  const detachListeners = () => {
    window.removeEventListener('scroll', handleScroll)
  }

  const keepInViewFunc = () => {
    if (props.blocking && props.keepInView && container.current) {
      const containerBounds = container.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (containerBounds.top > windowHeight || containerBounds.bottom < 0) return
      if (containerBounds.top >= 0 && containerBounds.bottom <= windowHeight) return
      const topDelta = Math.min(containerBounds.top, 0)
      const bottomDelta = Math.max(containerBounds.bottom - windowHeight, 0)
      const scrollDelta = topDelta || bottomDelta
      window.scrollBy({
        top: scrollDelta,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  function handleScroll() {
    keepInViewFunc()
  }

  return (
    <Tag {...attributes} className={classes} aria-busy={blocking}>
      {blocking && (
        <div
          tabIndex={0}
          role="presentation"
          onKeyUp={tabbedUpTop}
          onKeyDown={tabbedDownTop}
          ref={topFocus}
        >
          <div className="sr-only">{message || ariaLabel}</div>
        </div>
      )}
      {renderChilds && children}
      {blocking && (
        <div
          className="block-ui-container"
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label={message ?? ariaLabel}
          ref={blocker}
          style={{ minHeight: '100px' }}
          onKeyUp={tabbedUpBottom}
          onKeyDown={tabbedDownBottom}
        >
          <div className="block-ui-overlay" ref={container} />
          <div
            className="block-ui-message-container"
            ref={messageContainer}
            style={{ top: keepInView ? top : undefined }}
          >
            <div className="block-ui-message">
              {message || <span className="sr-only">{ariaLabel}</span>}
              <div aria-hidden>{React.isValidElement(Loader) ? Loader : <Loader />}</div>
            </div>
          </div>
        </div>
      )}
      {blocking && (
        <div
          tabIndex={0}
          role="presentation"
          onKeyUp={tabbedUpBottomFocus}
          onKeyDown={tabbedDownBottomFocus}
          ref={bottomFocus}
        >
          <div className="sr-only">{message || ariaLabel}</div>
        </div>
      )}
      <span ref={helper} />
    </Tag>
  )
}
