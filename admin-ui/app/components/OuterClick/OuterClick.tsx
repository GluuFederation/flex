import React, { ReactNode, ReactElement } from 'react'
import ReactDOM from 'react-dom'
import some from 'lodash/some'

// Safely gets the browser document object,
// returns a simple mock for server rendering purposes
const getDocument = () =>
  typeof document === 'undefined'
    ? {
        querySelector() {
          return null
        },
      }
    : document

interface OuterClickProps {
  onClickOutside?: (evt: MouseEvent | TouchEvent) => void
  children: ReactNode
  excludedElements?: Array<React.Component | React.RefObject<any> | null>
  active?: boolean
}

class OuterClick extends React.Component<OuterClickProps> {
  static defaultProps = {
    onClickOutside: () => {},
    excludedElements: [],
    active: true,
  }

  private rootElement: HTMLElement | null = null
  private elementRef: React.Component | Element | null = null

  componentDidMount() {
    this.rootElement = getDocument().querySelector('body')

    if (this.rootElement) {
      this.rootElement.addEventListener('click', this.handleDocumentClick as EventListener)
      this.rootElement.addEventListener('touchstart', this.handleDocumentClick as EventListener)
    }
  }

  componentWillUnmount() {
    if (this.rootElement) {
      this.rootElement.removeEventListener('click', this.handleDocumentClick as EventListener)
      this.rootElement.removeEventListener('touchstart', this.handleDocumentClick as EventListener)
    }
  }

  assignRef = (elementRef: React.Component | Element | null) => {
    this.elementRef = elementRef
  }

  handleDocumentClick = (evt: MouseEvent | (TouchEvent & { path?: any[]; target: any })) => {
    if (this.openSidebar((evt as any).path)) {
      if (this.props.active) {
        // eslint-disable-next-line react/no-find-dom-node
        const domElement = ReactDOM.findDOMNode(this.elementRef) as HTMLElement | null

        const isExcluded = some(this.props.excludedElements, (element) => {
          if (!element) return false
          let node: Element | null = null
          // If it's a ref object, use its current
          if (typeof (element as React.RefObject<any>).current !== 'undefined') {
            node = ReactDOM.findDOMNode(
              (element as React.RefObject<any>).current,
            ) as HTMLElement | null
          } else {
            node = ReactDOM.findDOMNode(element as React.Component) as HTMLElement | null
          }
          return node && node.contains(evt.target)
        })

        if (!isExcluded && domElement && !domElement.contains(evt.target)) {
          this.props.onClickOutside && this.props.onClickOutside(evt)
        }
      }
    }
  }

  openSidebar(path: any[] | undefined) {
    const exists = path?.some((item: any) => item.id === 'navToggleBtn')
    if (exists) return false

    return true
  }

  render() {
    const onlyChild = React.Children.only(this.props.children)

    const updatedChild = React.isValidElement(onlyChild)
      ? React.cloneElement(onlyChild as ReactElement, { ref: this.assignRef })
      : onlyChild

    return updatedChild
  }
}

export { OuterClick }
