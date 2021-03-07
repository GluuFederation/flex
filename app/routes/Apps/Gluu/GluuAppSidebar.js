import React from 'react'
import { SidebarMenu, Divider } from './../../../components'
import { connect } from 'react-redux'
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
} from '../../../utils/PermChecker'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
function GluuAppSidebar({ scopes }) {
  const plugins = localStorage.getItem("plugins");

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {/* -------- Home ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-home"></i>}
          title="Home"
        >
          <SidebarMenu.Item title="Reports" to="/home/reports" exact />
        </SidebarMenu.Item>
        {/* -------- Attributes ---------*/}

        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-briefcase"></i>}
          title="Attributes"
        >
          {(hasPermission(scopes, ATTRIBUTE_READ) && (
            <SidebarMenu.Item title="All Attributes" to="/attributes" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, ATTRIBUTE_WRITE) && (
            <SidebarMenu.Item title="New Attribute" to="/attribute/new" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
        </SidebarMenu.Item>

        {/* -------- OIDC ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-cubes"></i>}
          title="Clients"
        >
          {(hasPermission(scopes, CLIENT_READ) && (
            <SidebarMenu.Item title="All Clients" to="/clients" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, CLIENT_WRITE) && (
            <SidebarMenu.Item title="New Client" to="/client/new" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
        </SidebarMenu.Item>
        {/* -------- Scopes ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-sitemap"></i>}
          title="Scopes"
        >
          {(hasPermission(scopes, SCOPE_READ) && (
            <SidebarMenu.Item title="All Scopes" to="/scopes" />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, SCOPE_WRITE) && (
            <SidebarMenu.Item title="New Scope" to="/scope/new" />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
        </SidebarMenu.Item>
        {/* -------- Custom scripts ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-puzzle-piece"></i>}
          title="Custom Scripts"
        >
          {(hasPermission(scopes, SCRIPT_READ) && (
            <SidebarMenu.Item title="All Scripts" to="/scripts" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, SCRIPT_WRITE) && (
            <SidebarMenu.Item title="New Script" to="/script/new" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
        </SidebarMenu.Item>
        {/* -------- Scopes ---------*/}
        {/* -------- Plugins ---------*/}
        {JSON.parse(plugins).map((item, key) => (
            <SidebarMenu.Item key={key} title={item.title} to={item.path}></SidebarMenu.Item>
        ))}
        <Divider />
        <Divider />
        {/* -------- Configuration ---------*/}
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-gears"></i>}
          title="Configuration"
        >
          {(hasPermission(scopes, SMTP_READ) && (
            <SidebarMenu.Item title="Smtp" to="/config/smtp" />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, FIDO_READ) && (
            <SidebarMenu.Item title="Fido2" to="/config/fido" />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, LDAP_READ) && (
            <SidebarMenu.Item title="Ldap" to="/config/ldap" />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, COUCHBASE_READ) && (
            <SidebarMenu.Item title="Couchbase" to="/config/couchbase" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, CACHE_READ) && (
            <SidebarMenu.Item title="Cache" to="/config/cache" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, ACR_READ) && (
            <SidebarMenu.Item title="Acrs" to="/config/acrs" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, LOGGING_READ) && (
            <SidebarMenu.Item title="Logging" to="/config/logging" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
          {(hasPermission(scopes, JWKS_READ) && (
            <SidebarMenu.Item title="Jwks" to="/config/jwks" exact />
          )) || <SidebarMenu.Item isEmptyNode={true} />}
        </SidebarMenu.Item>
        <Divider />
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-wrench"></i>}
          title="Settings"
          to="/settings-edit"
        />
        <SidebarMenu.Item
          icon={<i className="fa fa-fw fa-sign-out mr-2"></i>}
          title="Sign out"
          to="/logout"
        />
      </SidebarMenu>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({ authReducer }) => {
  const scopes = authReducer.permissions
  return {
    scopes,
  }
}

export default connect(mapStateToProps)(GluuAppSidebar)
