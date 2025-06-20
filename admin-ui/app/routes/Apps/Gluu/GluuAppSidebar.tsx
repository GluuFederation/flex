import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { SidebarMenu, SidebarMenuItem } from 'Components'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { processMenus } from 'Plugins/PluginMenuResolver'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import CachedIcon from '@mui/icons-material/Cached'
import LockIcon from '@mui/icons-material/Lock'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import styles from './styles/GluuAppSidebar.style'
import { MenuContext } from '../../../components/SidebarMenu/MenuContext'

import {
  WaveIcon,
  HomeIcon,
  OAuthIcon,
  UserClaimsIcon,
  ServicesIcon,
  UsersIcon,
  FidoIcon,
  ScimIcon,
  SamlIcon,
  JansKcLinkIcon,
  StmpZoneIcon,
} from '../../../components/SVG'
import { useCedarling } from '@/cedarling'

// Constants - Extract to improve performance and maintainability
const VISIBILITY_CONDITIONS: Record<string, string> = {
  '/jans-lock': 'jans-lock',
  '/fido/fidomanagement': 'jans-fido2',
  '/scim': 'jans-scim',
} as const

const ICON_STYLES = {
  default: { top: '-2px', height: '28px', width: '28px' },
  saml: { top: 0, height: '28px', width: '28px' },
  script: { fontSize: '28px' },
} as const

// Icon mapping for better performance - O(1) lookup instead of O(n) switch
const MENU_ICON_MAP: Record<string, React.ReactNode> = {
  home: <HomeIcon className="menu-icon" />,
  oauthserver: <OAuthIcon className="menu-icon" />,
  services: <ServicesIcon className="menu-icon" />,
  user_claims: <UserClaimsIcon className="menu-icon" />,
  scripts: <i className="menu-icon fas fa-file-code" style={ICON_STYLES.script} />,
  usersmanagement: <UsersIcon className="menu-icon" />,
  stmpmanagement: <StmpZoneIcon className="menu-icon" />,
  fidomanagement: <FidoIcon className="menu-icon" />,
  scim: <ScimIcon className="menu-icon" />,
  jans_link: <CachedIcon className="menu-icon" style={ICON_STYLES.default} />,
  jans_lock: <LockIcon className="menu-icon" style={ICON_STYLES.default} />,
  jans_kc_link: <JansKcLinkIcon className="menu-icon" style={ICON_STYLES.default} />,
  saml: <SamlIcon className="menu-icon" style={ICON_STYLES.saml} />,
} as const

// Type definitions
interface MenuItem {
  icon?: string
  path?: string
  title?: string
  permission?: string
  children?: MenuItem[]
}

interface PluginMenu extends MenuItem {}

interface RootState {
  authReducer: {
    token?: {
      scopes: string[]
    }
    permissions?: string[]
  }
  healthReducer: {
    health: Record<string, string>
  }
  userReducer: {
    isUserLogout: boolean
  }
}

// Custom selectors for better performance
const selectHealth = (state: RootState) => state.healthReducer.health
const selectIsUserLogout = (state: RootState) => state.userReducer.isUserLogout

function GluuAppSidebar() {
  const health = useSelector(selectHealth)
  const isUserLogout = useSelector(selectIsUserLogout)
  const [pluginMenus, setPluginMenus] = useState<PluginMenu[]>([])
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as { state: { theme: string } }
  const selectedTheme = theme.state.theme
  const { classes } = styles()
  const navigate = useNavigate()
  const { authorize, hasCedarPermission } = useCedarling()

  // Memoized values
  const fetchedServersLength = useMemo(() => Object.keys(health).length > 0, [health])

  const sidebarMenuActiveClass = useMemo(
    () => `sidebar-menu-active-${selectedTheme}`,
    [selectedTheme],
  )

  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  // Optimized icon renderer - O(1) lookup instead of O(n) switch
  const getMenuIcon = useCallback((name?: string): React.ReactNode => {
    if (!name) return null
    return MENU_ICON_MAP[name] ?? null
  }, [])

  // Memoized helper functions
  const getMenuPath = useCallback((menu: MenuItem): string | undefined => {
    return menu.children ? undefined : (menu.path ?? undefined)
  }, [])

  const hasChildren = useCallback((plugin: MenuItem): boolean => {
    return Array.isArray(plugin.children) && plugin.children.length > 0
  }, [])

  const filterMenuItems = async (menus) => {
    const result = []

    for (const item of menus) {
      if (hasChildren(item)) {
        const filteredChildren = await filterMenuItems(item.children)

        if (filteredChildren.length > 0) {
          result.push({ ...item, children: filteredChildren })
        }
      } else if (item.permission) {
        const { isAuthorized } = await authorize([item.permission])
        if (isAuthorized) {
          result.push(item)
        }
      }
    }
    return result
  }

  // Memoized menu filtering logic
  const memoizedFilteredMenus = useMemo(() => {
    const menus: PluginMenu[] = processMenus()

    if (!fetchedServersLength) {
      return []
    }

    return menus.filter((menu: PluginMenu) => {
      const healthKey = VISIBILITY_CONDITIONS[menu.path || '']
      return healthKey ? health?.[healthKey] === 'Running' : true
    })
  }, [health, fetchedServersLength])

  useEffect(() => {
    async function loadMenus() {
      console.log('memoizedFilteredMenus', memoizedFilteredMenus)
      const filteredMenus = await filterMenuItems(memoizedFilteredMenus)
      console.log(filteredMenus)
      setPluginMenus(filteredMenus)
    }

    loadMenus()
  }, [memoizedFilteredMenus])

  useEffect(() => {
    if (isUserLogout) {
      navigate('/logout')
    }
  }, [isUserLogout, navigate])

  const gettingPermissionMemoizing = (item: any) =>
    !authorize([item.permission]) && !hasChildren(item)

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {fetchedServersLength ? (
          <MenuContext.Consumer>
            {(ctx: any) =>
              pluginMenus.map((plugin, key) => (
                <SidebarMenuItem
                  key={key}
                  icon={getMenuIcon(plugin.icon)}
                  to={getMenuPath(plugin)}
                  title={t(`${plugin.title}`)}
                  // isEmptyNode={!hasCedarPermission(plugin.permission) && !hasChildren(plugin)}
                  isEmptyNode={gettingPermissionMemoizing(plugin)}
                  textStyle={{ fontSize: '18px' }}
                  sidebarMenuActiveClass={sidebarMenuActiveClass}
                  {...ctx}
                >
                  {hasChildren(plugin) &&
                    plugin.children!.map((item, idx) => (
                      <SidebarMenuItem
                        key={idx}
                        title={t(`${item.title}`)}
                        // isEmptyNode={!hasCedarPermission(item.permission) && !hasChildren(item)}
                        isEmptyNode={gettingPermissionMemoizing(item)}
                        to={getMenuPath(item)}
                        icon={getMenuIcon(item.icon)}
                        textStyle={{ fontSize: '15px' }}
                        exact
                        {...ctx}
                      >
                        {hasChildren(item) &&
                          item.children!.map((sub, id) => (
                            <SidebarMenuItem
                              key={id}
                              title={t(`${sub.title}`)}
                              to={getMenuPath(sub)}
                              // isEmptyNode={!hasCedarPermission(sub.permission)}
                              isEmptyNode={gettingPermissionMemoizing(sub)}
                              icon={getMenuIcon(sub.icon)}
                              textStyle={{ fontSize: '15px' }}
                              exact
                              {...ctx}
                            ></SidebarMenuItem>
                          ))}
                      </SidebarMenuItem>
                    ))}
                </SidebarMenuItem>
              ))
            }
          </MenuContext.Consumer>
        ) : (
          <div style={{ marginTop: '20vh' }}>
            <GluuLoader blocking={!fetchedServersLength} />
          </div>
        )}

        <div className={fetchedServersLength ? classes.waveContainer : classes.waveContainerFixed}>
          <WaveIcon className={classes.wave} fill={themeColors.menu.background} />
          <div className={classes.powered}>Powered by Gluu</div>
        </div>
      </SidebarMenu>
    </ErrorBoundary>
  )
}

// Memoize the entire component to prevent unnecessary re-renders
const MemoizedGluuAppSidebar = React.memo(GluuAppSidebar)

export default MemoizedGluuAppSidebar
