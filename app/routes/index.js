import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { useSelector } from 'react-redux'

// ----------- Pages Imports ---------------
import Reports from './Dashboards/Reports'

import NavbarOnly from './Layouts/NavbarOnly'
import SidebarDefault from './Layouts/SidebarDefault'
import SidebarA from './Layouts/SidebarA'
import DragAndDropLayout from './Layouts/DragAndDropLayout'
import SidebarWithNavbar from './Layouts/SidebarWithNavbar'

import AttributeListPage from './Apps/Attibutes/AttributeListPage'
import AttributeAddPage from './Apps/Attibutes/AttributeAddPage'
import AttributeEditPage from './Apps/Attibutes/AttributeEditPage'

import ClientListPage from './Apps/Clients/ClientListPage'
import ClientAddPage from './Apps/Clients/ClientAddPage'
import ClientEditPage from './Apps/Clients/ClientEditPage'

import CustomScriptListPage from './Apps/Scripts/CustomScriptListPage'
import CustomScriptAddPage from './Apps/Scripts/CustomScriptAddPage'
import CustomScriptEditPage from './Apps/Scripts/CustomScriptEditPage'

import ScriptListPage from './Apps/CustomScripts/ScriptListPage'

import ProfilePage from './Apps/Profile/ProfilePage'
// ----------- Layout Imports ---------------
import { DefaultSidebar } from './../layout/components/DefaultSidebar'
import ScopeListPage from './Apps/Scopes/ScopeListPage'
import ScopeAddPage from './Apps/Scopes/ScopeAddPage'
import ScopeEditPage from './Apps/Scopes/ScopeEditPage'
import ByeBye from './Pages/ByeBye'
import SmtpPage from './Apps/Configuration/SmtpPage'
import AcrsPage from './Apps/Configuration/AcrsPage'
import LoggingPage from './Apps/Configuration/LoggingPage'
import JwksPage from './Apps/Configuration/JwksPage'
import Fido2Page from './Apps/Configuration/Fido2Page'
import CachePage from './Apps/Configuration/CachePage'
import LdapListPage from './Apps/Configuration/LdapListPage'
import LdapAddPage from './Apps/Configuration/LdapAddPage'
import LdapEditPage from './Apps/Configuration/LdapEditPage'
import CouchbasePage from './Apps/Configuration/CouchbasePage'
import {
  hasPermission,
  ATTRIBUTE_READ,
  ATTRIBUTE_WRITE,
  CLIENT_READ,
  CLIENT_WRITE,
  SCOPE_READ,
  SCOPE_WRITE,
  SCRIPT_READ,
  SCRIPT_WRITE,
  SMTP_READ,
  ACR_READ,
  LOGGING_READ,
  JWKS_READ,
  FIDO_READ,
  CACHE_READ,
  LDAP_READ,
  COUCHBASE_READ,
  LDAP_WRITE,
} from '../utils/PermChecker'
import Gluu404Error from './Apps/Gluu/Gluu404Error'
import GluuNavBar from './Apps/Gluu/GluuNavBar'
import { selectPlugin } from '../../plugins/selector'

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
  const scopes = useSelector((state) => state.authReducer.permissions)
  const availablePlugins = useSelector(
    (state) => state.pluginMenuReducer.plugins,
  )

  return (
    <Switch>
      <Redirect from="/" to="/home/dashboard" exact />
      {/*<Route path="/home/analytics" exact component={ Analytics } />*/}
      <Route path="/home/dashboard" exact component={Reports} />

      {/*    Layouts     */}
      <Route path="/layouts/navbar" component={NavbarOnly} />
      <Route path="/layouts/sidebar" component={SidebarDefault} />
      <Route path="/layouts/sidebar-a" component={SidebarA} />
      <Route
        path="/layouts/sidebar-with-navbar"
        component={SidebarWithNavbar}
      />

      {/*    Apps Routes     */}

      {/*    Attributes Routes     */}
      {hasPermission(scopes, ATTRIBUTE_READ) && (
        <Route component={AttributeListPage} path="/attributes" />
      )}
      {hasPermission(scopes, ATTRIBUTE_WRITE) && (
        <Route component={AttributeAddPage} path="/attribute/new" />
      )}
      {hasPermission(scopes, ATTRIBUTE_WRITE) && (
        <Route component={AttributeEditPage} path="/attribute/edit:gid" />
      )}
      {/*    Clients Routes     */}
      {hasPermission(scopes, CLIENT_READ) && (
        <Route component={ClientListPage} path="/clients" />
      )}
      {hasPermission(scopes, CLIENT_WRITE) && (
        <Route component={ClientAddPage} path="/client/new" />
      )}
      {hasPermission(scopes, CLIENT_WRITE) && (
        <Route component={ClientEditPage} path="/client/edit:gid" />
      )}
      {/*    Scopes Routes     */}
      {hasPermission(scopes, SCOPE_READ) && (
        <Route component={ScopeListPage} path="/scopes" />
      )}
      {hasPermission(scopes, SCOPE_WRITE) && (
        <Route component={ScopeAddPage} path="/scope/new" />
      )}
      {hasPermission(scopes, SCOPE_WRITE) && (
        <Route component={ScopeEditPage} path="/scope/edit:gid" />
      )}
      {/*    Scripts Routes     */}
      {hasPermission(scopes, SCRIPT_READ) && (
        <Route component={ScriptListPage} path="/scripts" />
      )}
      {hasPermission(scopes, SCRIPT_WRITE) && (
        <Route component={CustomScriptAddPage} path="/script/new" />
      )}
      {hasPermission(scopes, SCRIPT_WRITE) && (
        <Route component={CustomScriptEditPage} path="/script/edit:gid" />
      )}
      {/*    Configuration Routes     */}
      {hasPermission(scopes, SMTP_READ) && (
        <Route component={SmtpPage} path="/config/smtp" />
      )}
      {hasPermission(scopes, ACR_READ) && (
        <Route component={AcrsPage} path="/config/acrs" />
      )}
      {hasPermission(scopes, LOGGING_READ) && (
        <Route component={LoggingPage} path="/config/logging" />
      )}
      {hasPermission(scopes, JWKS_READ) && (
        <Route component={JwksPage} path="/config/jwks" />
      )}
      {hasPermission(scopes, FIDO_READ) && (
        <Route component={Fido2Page} path="/config/fido" />
      )}
      {hasPermission(scopes, CACHE_READ) && (
        <Route component={CachePage} path="/config/cache" />
      )}
      {hasPermission(scopes, LDAP_WRITE) && (
        <Route component={LdapEditPage} path="/config/ldap/edit:configId" />
      )}
      {hasPermission(scopes, LDAP_WRITE) && (
        <Route component={LdapAddPage} path="/config/ldap/new" />
      )}
      {hasPermission(scopes, LDAP_READ) && (
        <Route component={LdapListPage} path="/config/ldap" />
      )}
      {hasPermission(scopes, COUCHBASE_READ) && (
        <Route component={CouchbasePage} path="/config/couchbase" />
      )}

      {/* -------- Plugins ---------*/}
      {availablePlugins.map((item, key) => (
        <Route key={key} component={selectPlugin(item.key)} path={item.path} />
      ))}

      {/*    Pages Routes    */}
      <Route component={ProfilePage} path="/profile" />
      <Route component={ByeBye} path="/logout" />
      <Route component={Gluu404Error} path="/error-404" />

      {/*    404    */}
      <Redirect to="/error-404" />
    </Switch>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Switch>
    <Route
      component={() => (
        <GluuNavBar themeStyle="color" themeColor="primary" navStyle="accent" />
      )}
    />
  </Switch>
)

export const RoutedSidebars = () => (
  <Switch>
    <Route component={DefaultSidebar} />
  </Switch>
)
