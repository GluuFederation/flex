// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react'
import DefaultLoader from './DefaultLoader'
import safeActiveElement from './safeActiveElement'

export default function BlockUi(props) {
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

  const [top] = useState('50%')
  const [focused, setFocused] = useState(null)

  const helper = useRef(null)
  const blocker = useRef(null)
  const topFocus = useRef(null)
  const container = useRef(null)
  const messageContainer = useRef(null)

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
          (window.setImmediate || setTimeout)(
            () => focused && typeof focused.blur === 'function' && focused.blur(),
          )
        }
      }
    } else {
      detachListeners()
      const ae = safeActiveElement()
      if (focused && (!ae || ae === document.body || ae === topFocus.current)) {
        if (typeof focused.focus === 'function') {
          focused.focus()
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

  const blockingTab = (e, withShift = false) => {
    return blocking && (e.key === 'Tab' || e.keyCode === 9) && e.shiftKey == withShift
  }

  const tabbedUpTop = (e) => {
    if (blockingTab(e)) {
      blocker.current.focus()
    }
  }

  const tabbedDownTop = (e) => {
    if (blockingTab(e)) {
      e.preventDefault()
      blocker.current.focus()
    }
  }

  const tabbedUpBottom = (e) => {
    if (blockingTab(e, true)) {
      topFocus.current.focus()
    }
  }

  const tabbedDownBottom = (e) => {
    if (blockingTab(e, true)) {
      e.preventDefault()
      topFocus.current.focus()
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
    keepInView()
  }

  return (
    <Tag {...attributes} className={classes} aria-busy={blocking}>
      {blocking && (
        <div tabIndex="0" onKeyUp={tabbedUpTop} onKeyDown={tabbedDownTop} ref={topFocus}>
          <div className="sr-only">{message || ariaLabel}</div>
        </div>
      )}
      {renderChilds && children}
      {blocking && (
        <div
          className="block-ui-container"
          tabIndex="0"
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
      <span ref={helper} />
    </Tag>
  )
}
