import React, {
  ReactNode,
  CSSProperties,
  MouseEvent,
  useEffect,
  useId,
  useContext,
  useMemo,
} from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { MenuContext, type SidebarMenuContext } from './MenuContext'
import customColors from '@/customColors'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { ChevronIcon } from '../SVG'

interface SidebarMenuItemLinkProps {
  to?: string | null
  handleClick?: () => void
  href?: string | null
  active?: boolean
  onToggle?: () => void
  children?: ReactNode
  classBase: string
  textStyle?: CSSProperties
  sidebarMenuActive?: string
}

/**
 * Renders a collapse trigger or a ReactRouter Link
 */
const SidebarMenuItemLink: React.FC<SidebarMenuItemLinkProps> = (props) => {
  return props.to || props.href ? (
    props.to !== 'logout' ? (
      <Link
        to={props.to as string}
        style={props.textStyle}
        className={`${props.classBase}__entry__link`}
      >
        {props.children}
      </Link>
    ) : props.to === 'logout' ? (
      <Link
        to={'#'}
        style={props.textStyle}
        className={`${props.classBase}__entry__link`}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault()
          if (props.handleClick) {
            props.handleClick()
          }
        }}
      >
        {props.children}
      </Link>
    ) : (
      <a
        href={props.href || undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`${props.classBase}__entry__link`}
        style={props.textStyle}
      >
        {props.children}
      </a>
    )
  ) : (
    <a
      className={`${props.classBase}__entry__link ${props.sidebarMenuActive}`}
      onClick={() => props.onToggle && props.onToggle()}
      style={props.textStyle}
    >
      {props.children}
    </a>
  )
}

interface SidebarMenuEntry {
  id: string
  parentId?: string
  exact: boolean
  url?: string
  open?: boolean
  active?: boolean
}

interface SidebarMenuItemProps {
  // Provided props
  parentId?: string
  children?: ReactNode
  isSubNode?: boolean
  currentUrl?: string
  slim?: boolean
  // User props
  icon?: React.ReactElement
  title?: string | ReactNode
  to?: string
  href?: string
  exact?: boolean
  noCaret?: boolean
  textStyle?: CSSProperties
  handleClick?: () => void
  sidebarMenuActiveClass?: string
  isEmptyNode?: boolean
}

/**
 * The main menu entry component
 */
export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  parentId,
  children,
  isSubNode,
  currentUrl,
  slim,
  icon,
  title,
  to,
  href,
  exact = true,
  noCaret,
  textStyle,
  handleClick,
  sidebarMenuActiveClass,
  isEmptyNode = false,
}) => {
  const { entries, addEntry, updateEntry, removeEntry } = useContext(MenuContext)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme || DEFAULT_THEME
  const id = useId()

  useEffect(() => {
    const entry: SidebarMenuEntry = {
      id,
      parentId,
      exact: !!exact,
    }

    if (to) {
      entry.url = to
    }

    addEntry(entry)

    return () => {
      removeEntry(id)
    }
  }, [id, parentId, exact, to, addEntry, removeEntry])

  const getEntry = () => {
    return entries[id]
  }

  const toggleNode = () => {
    const entry = getEntry()
    if (entry) {
      updateEntry(id, { open: !entry.open })
    }
  }

  const entry = getEntry()
  const sidebarMenuActive =
    entry && entry.active && sidebarMenuActiveClass ? sidebarMenuActiveClass : ''
  const classBase = isSubNode ? 'sidebar-submenu' : `sidebar-menu`
  const itemClass = classNames(`${classBase}__entry cursor-pointer`, {
    [`${classBase}__entry--nested`]: !!children,
    open: entry && entry.open,
    active: entry && entry.active,
  })
  const activeMenu: CSSProperties = {
    color: customColors.darkGray,
  }
  const nonaActiveMenu: CSSProperties = {}

  const iconFillColor = useMemo(() => {
    const isActive = entry?.active
    if (isActive) {
      return selectedTheme === THEME_DARK ? customColors.white : customColors.primaryDark
    }
    return selectedTheme === THEME_DARK ? customColors.white : customColors.textSecondary
  }, [entry?.active, selectedTheme])

  function getStyle(itemClass: string): CSSProperties {
    if (
      itemClass.includes('active') &&
      itemClass.includes('submenu__entry') &&
      !itemClass.includes('open')
    ) {
      return activeMenu
    }
    return nonaActiveMenu
  }

  function getTextStyle(itemClass: string): CSSProperties | null {
    if (itemClass.includes('active') && itemClass.includes('submenu__entry')) {
      return { fontWeight: 'bold' }
    }
    return null
  }

  return (
    <li
      style={getStyle(itemClass)}
      className={classNames(itemClass, {
        'sidebar-menu__entry--no-caret': noCaret,
        'mb-20': !!icon,
      })}
    >
      {!isEmptyNode && (
        <SidebarMenuItemLink
          to={to || null}
          href={href || null}
          onToggle={toggleNode}
          classBase={classBase}
          textStyle={getTextStyle(itemClass) || textStyle}
          sidebarMenuActive={sidebarMenuActive}
          handleClick={handleClick}
        >
          {icon &&
            React.cloneElement(icon, {
              className: classNames(icon.props.className, `${classBase}__entry__icon`),
              fill: iconFillColor,
            })}
          {typeof title === 'string' ? <span style={textStyle}>{title}</span> : title}
          {children && !noCaret && (
            <span
              className={`${classBase}__entry__chevron`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                flexShrink: 0,
                transition: 'transform 0.2s ease',
                transformOrigin: 'center center',
                ...(entry?.open ? { transform: 'rotate(0deg)' } : { transform: 'rotate(-90deg)' }),
              }}
            >
              <ChevronIcon width={22} height={22} />
            </span>
          )}
        </SidebarMenuItemLink>
      )}
      {children && (
        <ul className="sidebar-submenu">
          {React.Children.map(children, (child) =>
            child ? (
              <MenuContext.Consumer>
                {(ctx: SidebarMenuContext) =>
                  React.isValidElement(child)
                    ? React.cloneElement(child, {
                        isSubNode: true,
                        parentId: id,
                        currentUrl,
                        slim,
                        ...ctx,
                      })
                    : child
                }
              </MenuContext.Consumer>
            ) : null,
          )}
        </ul>
      )}
    </li>
  )
}
