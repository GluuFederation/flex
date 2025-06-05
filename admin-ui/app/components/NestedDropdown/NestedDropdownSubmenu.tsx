import React from 'react'
import classNames from 'classnames'
import { v4 as uuid } from 'uuid'

import { Consumer } from './context'

interface NestedDropdownSubmenuProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  tag?: React.ElementType;
  subMenuTag?: React.ElementType;
  className?: string;
  openId?: string;
  onOpen: (id: string) => void;
}

class NestedDropdownSubmenu extends React.Component<NestedDropdownSubmenuProps> {
  id: string;

  static readonly defaultProps = {
    tag: 'div',
    subMenuTag: 'div',
  };

  constructor(props: NestedDropdownSubmenuProps) {
    super(props);
    this.id = uuid();
  }

  render() {
    let {
      tag: Tag,
      subMenuTag: SubMenuTag,
      title,
      children,
      className,
      openId,
      onOpen
    } = this.props;
    Tag = Tag || 'div';
    SubMenuTag = SubMenuTag || 'div';
    const itemClass = classNames(className, 'nested-dropdown__submenu-item', {
      'nested-dropdown__submenu-item--open': openId === this.id
    });
    const linkClass = classNames('nested-dropdown__submenu-item__link', 'dropdown-item');

    return (
      <Tag className={ itemClass }>
        <a
          href="#"
          className={ linkClass }
          onClick={ (e) => { e.preventDefault(); onOpen(this.id); } }
        >
          { title }
        </a>
        <div className="nested-dropdown__submenu-item__menu-wrap">
          <SubMenuTag className="nested-dropdown__submenu-item__menu dropdown-menu">
            { children }
          </SubMenuTag>
        </div>
      </Tag>
    );
  }
}

const ContextNestedDropdownSubmenu: React.FC<Omit<NestedDropdownSubmenuProps, 'openId' | 'onOpen'> & Partial<Pick<NestedDropdownSubmenuProps, 'openId' | 'onOpen'>>> = (props) => (
  <Consumer>
    {(contextProps: any) => (
      <NestedDropdownSubmenu { ...contextProps } { ...props } />
    )}
  </Consumer>
);

export {
  ContextNestedDropdownSubmenu as NestedDropdownSubmenu
}


