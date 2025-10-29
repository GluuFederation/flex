import React from 'react'
import { SidebarMenu, SidebarMenuItem } from 'Components'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useDispatch } from 'react-redux'
import type { SidebarMiddleNavProps, LayoutDispatch } from './types'

export const SidebarMiddleNav: React.FC<SidebarMiddleNavProps> = () => {
  const dispatch = useDispatch() as LayoutDispatch
  return (
    <SidebarMenu>
      {/* -------- Home ---------*/}
      <SidebarMenuItem icon={<i className="fa fa-fw fa-home"></i>} title="Home">
        <SidebarMenuItem title="Reports" to="/home/reports" exact />
      </SidebarMenuItem>
      {/* -------- Attributes ---------*/}

      <SidebarMenuItem icon={<i className="fa fa-fw fa-briefcase"></i>} title="Attributes">
        <SidebarMenuItem title="All Attributes" to="/attributes" exact />
        <SidebarMenuItem title="New Attribute" to="/attribute/new" exact />
      </SidebarMenuItem>

      {/* -------- OIDC ---------*/}
      <SidebarMenuItem icon={<i className="fa fa-fw fa-cubes"></i>} title="Clients">
        <SidebarMenuItem title="All Clients" to="/clients" exact />
        <SidebarMenuItem title="New Client" to="/client/new" exact />
      </SidebarMenuItem>
      {/* -------- Scopes ---------*/}
      <SidebarMenuItem icon={<i className="fa fa-fw fa-sitemap"></i>} title="Scopes">
        <SidebarMenuItem title="All Scopes" to="/scopes" />
        <SidebarMenuItem title="New Scope" to="/scope/new" />
      </SidebarMenuItem>
      {/* -------- Custom scripts ---------*/}
      <SidebarMenuItem icon={<i className="fa fa-fw fa-puzzle-piece"></i>} title="Custom Scripts">
        <SidebarMenuItem title="All Scripts" to="/scripts" exact />
        <SidebarMenuItem title="New Script" to="/script/new" exact />
      </SidebarMenuItem>
      {/* -------- Scopes ---------*/}
      {/* -------- Plugins ---------*/}

      {/* -------- Configuration ---------*/}
      <SidebarMenuItem icon={<i className="fa fa-fw fa-gears"></i>} title="Configuration">
        <SidebarMenuItem title="Smtp" to="/config/smtp" />
        <SidebarMenuItem title="Fido2" to="/config/fido" />
        <SidebarMenuItem title="Ldap" to="/config/ldap" />
        <SidebarMenuItem title="Couchbase" to="/config/couchbase" exact />
        <SidebarMenuItem title="Cache" to="/config/cache" exact />
        <SidebarMenuItem title="Acrs" to="/config/acrs" exact />
        <SidebarMenuItem title="Logging" to="/config/logging" exact />
        <SidebarMenuItem title="Jwks" to="/config/jwks" exact />
      </SidebarMenuItem>
      <SidebarMenuItem
        icon={<i className="fa fa-fw fa-wrench"></i>}
        title="Settings"
        to="/settings"
      />
      <SidebarMenuItem
        icon={<i className="fa fa-fw fa-sign-out me-2"></i>}
        title="Sign out"
        handleClick={() => {
          dispatch(auditLogoutLogs({ message: 'User logged out mannually' }))
        }}
        to="/logout"
      />
    </SidebarMenu>
  )
}
