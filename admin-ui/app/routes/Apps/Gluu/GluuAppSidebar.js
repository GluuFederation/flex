import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { SidebarMenu } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { processMenus } from 'Plugins/PluginMenuResolver'
import { useTranslation } from 'react-i18next'
import HomeIcon from 'Components/SVG/menu/Home'
import OAuthIcon from 'Components/SVG/menu/OAuth'
import UserClaimsIcon from 'Components/SVG/menu/UserClaims'
import ServicesIcon from 'Components/SVG/menu/Services'
import UsersIcon from 'Components/SVG/menu/Users'
import StmpIcon from 'Components/SVG/menu/Smtp'
import FidoIcon from 'Components/SVG/menu/Fido'
import ScimIcon from 'Components/SVG/menu/Scim'
import SamlIcon from 'Components/SVG/menu/Saml'
import JansKcLinkIcon from 'Components/SVG/menu/JansKcLinkIcon'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from 'Context/theme/themeContext'
import Wave from 'Components/SVG/SidebarWave'
import getThemeColor from 'Context/theme/config'
import CachedIcon from '@mui/icons-material/Cached'
import LockIcon from '@mui/icons-material/Lock'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import styles from './styles/GluuAppSidebar.style'
import { getDatabaseInfo } from 'Plugins/services/redux/features/persistenceTypeSlice'
import { useCedarling } from '../../../cedarling/hooks'

function GluuAppSidebar() {
  const { health, isUserLogout } = useSelector((state) => {
    return {
      health: state.healthReducer?.health,
      isUserLogout: state.userReducer?.isUserLogout,
    }
  })

  const [pluginMenus, setPluginMenus] = useState([])
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const sidebarMenuActiveClass = `sidebar-menu-active-${selectedTheme}`
  const { classes } = styles()
  const themeColors = getThemeColor(selectedTheme)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { hasCedarPermission } = useCedarling()

  const fetchedServersLength = useMemo(() => Object.keys(health).length > 0, [health])

  const processedMenus = useMemo(() => processMenus(), [])

  useEffect(() => {
    dispatch(getDatabaseInfo())

    if (fetchedServersLength) {
      const visibilityConditions = {
        '/jans-lock': 'jans-lock',
        '/fido/fidomanagement': 'jans-fido2',
        '/scim': 'jans-scim',
      }

      const filtered = processedMenus.reduce((acc, menu) => {
        const healthKey = visibilityConditions[menu.path]
        const isHealthOk = !healthKey || health?.[healthKey] === 'Running'
        if (isHealthOk) acc.push(menu)
        return acc
      }, [])

      setPluginMenus(filtered)
    }
  }, [health])

  useEffect(() => {
    if (isUserLogout) {
      navigate('/logout')
    }
  }, [isUserLogout])

  const menuIcons = useMemo(
    () => ({
      home: <HomeIcon className="menu-icon" />,
      oauthserver: <OAuthIcon className="menu-icon" />,
      services: <ServicesIcon className="menu-icon" />,
      user_claims: <UserClaimsIcon className="menu-icon" />,
      scripts: <i className="menu-icon fas fa-file-code" style={{ fontSize: '28px' }} />,
      usersmanagement: <UsersIcon className="menu-icon" />,
      stmpmanagement: <StmpIcon className="menu-icon" />,
      fidomanagement: <FidoIcon className="menu-icon" />,
      scim: <ScimIcon className="menu-icon" />,
      jans_link: (
        <CachedIcon className="menu-icon" style={{ top: '-2px', height: '28px', width: '28px' }} />
      ),
      jans_lock: (
        <LockIcon className="menu-icon" style={{ top: '-2px', height: '28px', width: '28px' }} />
      ),
      jans_kc_link: (
        <JansKcLinkIcon
          className="menu-icon"
          style={{ top: '-2px', height: '28px', width: '28px' }}
        />
      ),
      saml: <SamlIcon className="menu-icon" style={{ top: 0, height: '28px', width: '28px' }} />,
    }),
    [],
  )

  const getMenuIcon = useCallback((name) => menuIcons[name] || null, [menuIcons])

  const getMenuPath = (menu) => (menu.children ? null : menu.path)
  const hasChildren = (plugin) => plugin?.children !== undefined && plugin.children.length > 0
  const permitted = useCallback(
    (item) => !hasCedarPermission(item.permission) && !hasChildren(item),
    [hasCedarPermission],
  )

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {fetchedServersLength ? (
          pluginMenus.map((plugin, key) => (
            <SidebarMenu.Item
              key={key}
              icon={getMenuIcon(plugin.icon)}
              to={getMenuPath(plugin)}
              title={t(`${plugin.title}`)}
              isEmptyNode={permitted(plugin)}
              textStyle={{ fontSize: '18px' }}
              sidebarMenuActiveClass={sidebarMenuActiveClass}
            >
              {hasChildren(plugin) &&
                plugin.children.map((item, idx) => (
                  <SidebarMenu.Item
                    key={idx}
                    title={t(`${item.title}`)}
                    isEmptyNode={permitted(item)}
                    to={getMenuPath(item)}
                    icon={getMenuIcon(item.icon)}
                    textStyle={{ fontSize: '15px' }}
                    exact
                  >
                    {hasChildren(item) &&
                      item.children.map((sub, id) => (
                        <SidebarMenu.Item
                          key={id}
                          title={t(`${sub.title}`)}
                          to={getMenuPath(sub)}
                          isEmptyNode={permitted(sub)}
                          icon={getMenuIcon(sub.icon)}
                          textStyle={{ fontSize: '15px' }}
                          exact
                        ></SidebarMenu.Item>
                      ))}
                  </SidebarMenu.Item>
                ))}
            </SidebarMenu.Item>
          ))
        ) : (
          <div style={{ marginTop: '20vh' }}>
            <GluuLoader blocking={!fetchedServersLength} />
          </div>
        )}

        <div className={fetchedServersLength ? classes.waveContainer : classes.waveContainerFixed}>
          <Wave className={classes.wave} fill={themeColors.menu.background} />
          <div className={classes.powered}>Powered by Gluu</div>
        </div>
      </SidebarMenu>
    </ErrorBoundary>
  )
}

export default GluuAppSidebar
