import React from 'react'
import { SidebarMenu } from 'Components'
import { auditLogoutLogs } from '../../../plugins/user-management/redux/features/userSlice'
import { useDispatch } from 'react-redux'

export const SidebarMiddleNav = () => {
  const dispatch = useDispatch()
  return <SidebarMenu>
    {/* -------- Home ---------*/}
    <SidebarMenu.Item icon={<i className="fa fa-fw fa-home"></i>} title="Home">
      <SidebarMenu.Item title="Reports" to="/home/reports" exact />
    </SidebarMenu.Item>
    {/* -------- Attributes ---------*/}

    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-briefcase"></i>}
      title="Attributes"
    >
      <SidebarMenu.Item title="All Attributes" to="/attributes" exact />

      <SidebarMenu.Item title="New Attribute" to="/attribute/new" exact />
    </SidebarMenu.Item>

    {/* -------- OIDC ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-cubes"></i>}
      title="Clients"
    >
      <SidebarMenu.Item title="All Clients" to="/clients" exact />
      <SidebarMenu.Item title="New Client" to="/client/new" exact />
    </SidebarMenu.Item>
    {/* -------- Scopes ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-sitemap"></i>}
      title="Scopes"
    >
      <SidebarMenu.Item title="All Scopes" to="/scopes" />
      <SidebarMenu.Item title="New Scope" to="/scope/new" />
    </SidebarMenu.Item>
    {/* -------- Custom scripts ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-puzzle-piece"></i>}
      title="Custom Scripts"
    >
      <SidebarMenu.Item title="All Scripts" to="/scripts" exact />
      <SidebarMenu.Item title="New Script" to="/script/new" exact />
    </SidebarMenu.Item>
    {/* -------- Scopes ---------*/}
    {/* -------- Plugins ---------*/}

    {/* -------- Configuration ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-gears"></i>}
      title="Configuration"
    >
      <SidebarMenu.Item title="Smtp" to="/config/smtp" />
      <SidebarMenu.Item title="Fido2" to="/config/fido" />
      <SidebarMenu.Item title="Ldap" to="/config/ldap" />
      <SidebarMenu.Item title="Couchbase" to="/config/couchbase" exact />
      <SidebarMenu.Item title="Cache" to="/config/cache" exact />
      <SidebarMenu.Item title="Acrs" to="/config/acrs" exact />
      <SidebarMenu.Item title="Logging" to="/config/logging" exact />
      <SidebarMenu.Item title="Jwks" to="/config/jwks" exact />
    </SidebarMenu.Item>
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-wrench"></i>}
      title="Settings"
      to="/settings"
    />
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-sign-out me-2"></i>}
      title="Sign out"
      onClick={() => {dispatch(auditLogoutLogs({ message: "User logged out mannually" }));}}
      to="/logout"
    />
  </SidebarMenu>
}
