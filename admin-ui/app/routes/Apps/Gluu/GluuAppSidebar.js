import React, { useState, useEffect, useContext, useMemo } from 'react'
import { SidebarMenu } from 'Components'
import { useDispatch, useSelector } from 'react-redux'
import { hasPermission } from 'Utils/PermChecker'
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
import buildingCedarlingAuthReq from '../../../cedarling/utils/buildingCedarlingAuthReq'

function GluuAppSidebar() {
  const { scopes, role, sub, health, isUserLogout } = useSelector((state) => ({
    scopes: state.authReducer?.token?.scopes ?? state.authReducer?.permissions,
    role: state.authReducer?.userinfo?.jansAdminUIRole,
    sub: state.authReducer?.userinfo?.sub,
    health: state.healthReducer?.health,
    isUserLogout: state.userReducer?.isUserLogout,
  }))

  const [pluginMenus, setPluginMenus] = useState([])
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const sidebarMenuActiveClass = `sidebar-menu-active-${selectedTheme}`
  const { classes } = styles()
  const themeColors = getThemeColor(selectedTheme)
  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  useEffect(() => {
    buildingCedarlingAuthReq(role, scopes, sub)
  }, [role, scopes, sub])

  function getMenuIcon(name) {
    switch (name) {
      case 'home':
        return <HomeIcon className="menu-icon" />

      case 'oauthserver':
        return <OAuthIcon className="menu-icon" />

      case 'services':
        return <ServicesIcon className="menu-icon" />

      case 'user_claims':
        return <UserClaimsIcon className="menu-icon" />

      case 'scripts':
        return <i className="menu-icon fas fa-file-code" style={{ fontSize: '28px' }} />

      case 'usersmanagement':
        return <UsersIcon className="menu-icon" />

      case 'stmpmanagement':
        return <StmpIcon className="menu-icon" />

      case 'fidomanagement':
        return <FidoIcon className="menu-icon" />

      case 'scim':
        return <ScimIcon className="menu-icon" />

      case 'jans_link':
        return (
          <CachedIcon
            className="menu-icon"
            style={{ top: '-2px', height: '28px', width: '28px' }}
          />
        )
      case 'jans_lock':
        return (
          <LockIcon className="menu-icon" style={{ top: '-2px', height: '28px', width: '28px' }} />
        )
      case 'jans_kc_link':
        return (
          <JansKcLinkIcon
            className="menu-icon"
            style={{ top: '-2px', height: '28px', width: '28px' }}
          />
        )
      case 'saml':
        return <SamlIcon className="menu-icon" style={{ top: 0, height: '28px', width: '28px' }} />
      default:
        return null
    }
  }

  const getMenuPath = (menu) => (menu.children ? null : menu.path)

  const hasChildren = (plugin) => plugin?.children !== undefined && plugin.children.length > 0

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
              textStyle={{ fontSize: '18px' }}
              sidebarMenuActiveClass={sidebarMenuActiveClass}
            >
              {hasChildren(plugin) &&
                plugin.children.map((item, idx) => (
                  <SidebarMenu.Item
                    key={idx}
                    title={t(`${item.title}`)}
                    isEmptyNode={!hasPermission(scopes, item.permission) && !hasChildren(item)}
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
                          isEmptyNode={!hasPermission(scopes, sub.permission)}
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
