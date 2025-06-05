import React from 'react'
import classNames from 'classnames'
import { UncontrolledDropdown } from 'reactstrap'

import { Provider } from './context'

interface NestedDropdownProps {
  tag?: React.ElementType
  className?: string
  children?: React.ReactNode
}

interface NestedDropdownState {
  isOpen: boolean
}

export class NestedDropdown extends React.Component<NestedDropdownProps, NestedDropdownState> {
  static readonly defaultProps = {
    tag: UncontrolledDropdown
  }

  constructor(props: NestedDropdownProps) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.setIsOpen = this.setIsOpen.bind(this)
  }

  setIsOpen(isOpen: boolean) {
    this.setState({ isOpen })
  }

  render() {
    const { tag: TagProp, className, children, ...otherProps } = this.props
    const Tag = TagProp || UncontrolledDropdown
    const dropdownClass = classNames(className, 'nested-dropdown')

    return (
      <Tag { ...otherProps } className={ dropdownClass } >
        <Provider
          value={{
            isOpen: this.state.isOpen,
            setIsOpen: this.setIsOpen
          }}
        >
          { children }
        </Provider>
      </Tag>
    )
  }
}
