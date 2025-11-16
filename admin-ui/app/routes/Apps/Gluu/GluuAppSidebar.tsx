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
import type { SidebarMenuContext } from '../../../components/SidebarMenu/MenuContext'

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
import { CEDARLING_BYPASS } from '@/cedarling/utility'
import type {
  MenuItem,
  PluginMenu,
  VisibilityConditions,
  IconStyles,
  MenuIconMap,
  ThemeContextState,
  ThemeColors,
  SidebarRootState,
} from '../../../components/Sidebar'

// Constants - Extract to improve performance and maintainability
const VISIBILITY_CONDITIONS: VisibilityConditions = {
  '/jans-lock': 'jans-lock',
  '/fido/fidomanagement': 'jans-fido2',
  '/scim': 'jans-scim',
} as const

const ICON_STYLES: IconStyles = {
  default: { top: '-2px', height: '28px', width: '28px' },
  saml: { top: 0, height: '28px', width: '28px' },
  script: { fontSize: '28px' },
} as const

// Icon mapping for better performance - O(1) lookup instead of O(n) switch
const MENU_ICON_MAP: MenuIconMap = {
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

// Type definitions for local state
interface RootState extends SidebarRootState {}

const selectHealth = (state: RootState): Record<string, string> => state.healthReducer.health
const selectLogoutAuditSucceeded = (state: RootState): boolean | null =>
  state.logoutAuditReducer.logoutAuditSucceeded

function GluuAppSidebar(): JSX.Element {
  const health = useSelector(selectHealth)
  const logoutAuditSucceeded = useSelector(selectLogoutAuditSucceeded)
  const [pluginMenus, setPluginMenus] = useState<PluginMenu[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeContextState
  const selectedTheme = theme.state.theme
  const { classes } = styles()
  const navigate = useNavigate()
  const { authorize } = useCedarling()

  const fetchedServersLength = useMemo((): boolean => Object.keys(health).length > 0, [health])

  const sidebarMenuActiveClass = useMemo(
    (): string => `sidebar-menu-active-${selectedTheme}`,
    [selectedTheme],
  )

  const themeColors = useMemo((): ThemeColors => getThemeColor(selectedTheme), [selectedTheme])

  const getMenuIcon = useCallback((name?: string): React.ReactNode | null => {
    if (!name) return null
    return MENU_ICON_MAP[name] ?? null
  }, [])

  const getMenuPath = useCallback((menu: MenuItem): string | undefined => {
    return menu.children ? undefined : (menu.path ?? undefined)
  }, [])

  const hasChildren = useCallback((plugin: MenuItem): boolean => {
    return Array.isArray(plugin.children) && plugin.children.length > 0
  }, [])

  const filterMenuItems = useCallback(
    async (menus: MenuItem[]): Promise<MenuItem[]> => {
      const result: MenuItem[] = []

      for (const item of menus) {
        if (hasChildren(item)) {
          const filteredChildren = await filterMenuItems(item.children!)

          if (filteredChildren.length > 0) {
            result.push({ ...item, children: filteredChildren })
          }
        } else if (item.permission) {
          if (item.resourceKey === CEDARLING_BYPASS) {
            result.push(item)
            continue
          }
          if (!item.resourceKey) {
            console.warn('[Sidebar] Missing resourceKey for menu item', item.path ?? item.title)
            continue
          }
          const { isAuthorized } = await authorize([
            { permission: item.permission, resourceId: item.resourceKey },
          ])
          if (isAuthorized) {
            result.push(item)
          }
        } else {
          result.push(item)
        }
      }
      return result
    },
    [hasChildren, authorize],
  )

  const memoizedFilteredMenus = useMemo(async (): Promise<PluginMenu[]> => {
    const menus: PluginMenu[] = await processMenus()

    if (!fetchedServersLength) {
      return []
    }

    return menus.filter((menu: PluginMenu): boolean => {
      const healthKey = VISIBILITY_CONDITIONS[menu.path || '']
      return healthKey ? health?.[healthKey] === 'Running' : true
    })
  }, [health, fetchedServersLength])

  const loadMenus = async () => {
    try {
      const filteredMenus = await filterMenuItems(await memoizedFilteredMenus)
      setPluginMenus(filteredMenus)
    } finally {
      !loading && setLoading(true)
    }
  }

  useEffect(() => {
    loadMenus()
  }, [memoizedFilteredMenus, filterMenuItems])

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigate('/logout')
    }
  }, [logoutAuditSucceeded, navigate])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {loading ? (
          <MenuContext.Consumer>
            {(ctx: SidebarMenuContext) =>
              pluginMenus.map((plugin, key) => (
                <SidebarMenuItem
                  key={key}
                  icon={getMenuIcon(plugin.icon)}
                  to={getMenuPath(plugin)}
                  title={t(`${plugin.title}`)}
                  textStyle={{ fontSize: '18px' }}
                  sidebarMenuActiveClass={sidebarMenuActiveClass}
                  {...ctx}
                >
                  {hasChildren(plugin) &&
                    plugin.children!.map((item, idx) => (
                      <SidebarMenuItem
                        key={idx}
                        title={t(`${item.title}`)}
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
            <GluuLoader blocking={!loading} />
          </div>
        )}

        <div className={loading ? classes.waveContainer : classes.waveContainerFixed}>
          <WaveIcon className={classes.wave} fill={themeColors.menu.background} />
          <div className={classes.powered}>Powered by Gluu</div>
        </div>
      </SidebarMenu>
    </ErrorBoundary>
  )
}

const MemoizedGluuAppSidebar = React.memo(GluuAppSidebar)

export default MemoizedGluuAppSidebar
