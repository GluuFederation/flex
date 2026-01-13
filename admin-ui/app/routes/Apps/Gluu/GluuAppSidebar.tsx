import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react'
import { SidebarMenu, SidebarMenuItem } from 'Components'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { processMenus } from 'Plugins/PluginMenuResolver'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import CachedIcon from '@mui/icons-material/Cached'
import LockIcon from '@mui/icons-material/Lock'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import styles from './styles/GluuAppSidebar.style'
import { MenuContext } from '../../../components/SidebarMenu/MenuContext'
import type { SidebarMenuContext } from '../../../components/SidebarMenu/MenuContext'

import {
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
  ScriptsIcon,
} from '../../../components/SVG'
import { AdminUiFeatureResource, useCedarling } from '@/cedarling'
import { CEDARLING_BYPASS } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type {
  MenuItem,
  PluginMenu,
  VisibilityConditions,
  MenuIconMap,
  ThemeContextState,
  SidebarRootState,
} from '../../../components/Sidebar'

// Constants - Extract to improve performance and maintainability
const VISIBILITY_CONDITIONS: VisibilityConditions = {
  [ROUTES.JANS_LOCK_BASE]: 'jans-lock',
  [ROUTES.FIDO_BASE]: 'jans-fido2',
  [ROUTES.SCIM_BASE]: 'jans-scim',
  [ROUTES.SAML_BASE]: 'keycloak',
} as const

// Icon mapping for better performance - O(1) lookup instead of O(n) switch
const MENU_ICON_MAP: MenuIconMap = {
  home: <HomeIcon className="menu-icon" />,
  oauthserver: <OAuthIcon className="menu-icon" />,
  services: <ServicesIcon className="menu-icon" />,
  user_claims: <UserClaimsIcon className="menu-icon" />,
  scripts: <ScriptsIcon className="menu-icon" />,
  usersmanagement: <UsersIcon className="menu-icon" />,
  stmpmanagement: <StmpZoneIcon className="menu-icon" />,
  fidomanagement: <FidoIcon className="menu-icon" />,
  scim: <ScimIcon className="menu-icon" />,
  jans_link: <CachedIcon className="menu-icon" />,
  jans_lock: <LockIcon className="menu-icon" />,
  jans_kc_link: <JansKcLinkIcon className="menu-icon" />,
  saml: <SamlIcon className="menu-icon" />,
} as const

type RootState = SidebarRootState

const selectHealth = (state: RootState) => state.healthReducer.health
const selectLogoutAuditSucceeded = (state: RootState): boolean | null =>
  state.logoutAuditReducer.logoutAuditSucceeded

function GluuAppSidebar(): JSX.Element {
  const health = useSelector(selectHealth)
  const logoutAuditSucceeded = useSelector(selectLogoutAuditSucceeded)
  const [pluginMenus, setPluginMenus] = useState<PluginMenu[]>([])
  const didAnimateMenusRef = useRef<boolean>(false)
  const isReady = pluginMenus.length > 0
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeContextState
  const selectedTheme = theme.state.theme
  const { classes } = styles()
  const { authorize } = useCedarling()
  const { navigateToRoute } = useAppNavigation()

  const fetchedServersLength = useMemo((): boolean => Object.keys(health).length > 0, [health])

  const sidebarMenuActiveClass = useMemo(
    (): string => `sidebar-menu-active-${selectedTheme}`,
    [selectedTheme],
  )

  const getMenuIcon = useCallback((name?: string): React.ReactElement | undefined => {
    if (!name) return undefined
    const icon = MENU_ICON_MAP[name]
    return icon ? (icon as React.ReactElement) : undefined
  }, [])

  const getMenuPath = useCallback((menu: MenuItem): string | undefined => {
    return menu.children ? undefined : (menu.path ?? undefined)
  }, [])

  const hasChildren = useCallback((plugin: MenuItem): boolean => {
    return Array.isArray(plugin.children) && plugin.children.length > 0
  }, [])

  const filterMenuItems = useCallback(
    async (menus: MenuItem[]): Promise<MenuItem[]> => {
      const evaluations = await Promise.all(
        menus.map(async (item): Promise<MenuItem | null> => {
          if (hasChildren(item)) {
            const filteredChildren = await filterMenuItems(item.children!)
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren }
            }
            return null
          }
          if (item.permission) {
            if (item.resourceKey === CEDARLING_BYPASS) {
              return item
            }
            if (!item.resourceKey) {
              console.warn('[Sidebar] Missing resourceKey for menu item', item.path ?? item.title)
              return null
            }
            const { isAuthorized } = await authorize([
              {
                permission: item.permission,
                resourceId: item.resourceKey as AdminUiFeatureResource,
              },
            ])
            return isAuthorized ? item : null
          }
          return item
        }),
      )
      return evaluations.filter((x): x is MenuItem => !!x)
    },
    [hasChildren, authorize],
  )

  const memoizedFilteredMenus = useMemo(async (): Promise<PluginMenu[]> => {
    const menus: PluginMenu[] = await processMenus()

    if (!fetchedServersLength) {
      return []
    }

    return menus.filter((menu: PluginMenu): boolean => {
      const healthKey = menu.path
        ? VISIBILITY_CONDITIONS[menu.path as keyof VisibilityConditions]
        : undefined
      return healthKey ? health?.[healthKey] === 'Running' : true
    })
  }, [health, fetchedServersLength])

  const loadMenus = async () => {
    try {
      const filteredMenus = await filterMenuItems(await memoizedFilteredMenus)
      setPluginMenus(filteredMenus)
    } finally {
      if (!didAnimateMenusRef.current) {
        didAnimateMenusRef.current = true
      }
    }
  }

  useEffect(() => {
    loadMenus()
  }, [memoizedFilteredMenus, filterMenuItems])

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {isReady ? (
          <div
            className={`${!didAnimateMenusRef.current ? classes.menuFadeIn : ''} ${classes.menuContainer}`}
          >
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
          </div>
        ) : (
          <div className={classes.loaderRoot}>
            <GluuLoader blocking />
          </div>
        )}
      </SidebarMenu>
    </ErrorBoundary>
  )
}

const MemoizedGluuAppSidebar = React.memo(GluuAppSidebar)

export default MemoizedGluuAppSidebar
