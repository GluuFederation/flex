import React, { Suspense, lazy, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, SidebarTrigger } from 'Components'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import { useSelector } from 'react-redux'
import { useCedarling } from '../../cedarling/hooks'
import {
  ACR_READ,
  API_CONFIG_READ,
  ASSETS_READ,
  ATTRIBUTE_READ,
  CACHE_READ,
  CLIENT_READ,
  FIDO_READ,
  JANS_LOCK_READ,
  JWKS_READ,
  LICENSE_DETAILS_READ,
  LOGGING_READ,
  MAPPING_READ,
  PERMISSION_READ,
  PERSISTENCE_DETAIL,
  ROLE_READ,
  SAML_READ,
  SCIM_CONFIG_READ,
  SCOPE_READ,
  SCRIPT_READ,
  SESSION_READ,
  SMTP_READ,
  SSA_PORTAL,
  STAT_READ,
  USER_READ,
  WEBHOOK_READ,
} from '../../utils/PermChecker'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar = () => {
  const { authorize } = useCedarling()

  const { token } = useSelector((state) => {
    return {
      token: state.authReducer?.token?.access_token,
    }
  })
  const testAuth = async () => {
    if (token) {
      const permissionScopes = [
        SSA_PORTAL,
        SAML_READ,
        ACR_READ,
        ATTRIBUTE_READ,
        CACHE_READ,
        FIDO_READ,
        ASSETS_READ,
        JWKS_READ,
        LOGGING_READ,
        CLIENT_READ,
        PERSISTENCE_DETAIL,
        SCOPE_READ,
        SCRIPT_READ,
        SMTP_READ,
        STAT_READ,
        USER_READ,
        LICENSE_DETAILS_READ,
        PERMISSION_READ,
        ROLE_READ,
        MAPPING_READ,
        WEBHOOK_READ,
        API_CONFIG_READ,
        SESSION_READ,
        JANS_LOCK_READ,
        SCIM_CONFIG_READ,
      ]

      for (let i = 0; i < permissionScopes.length; i++) {
        await authorize([permissionScopes[i]])
      }

      console.log('Cedarling Authorization Test Completed')
    }
  }

  useEffect(() => {
    testAuth()
  }, [token])
  return (
    <Sidebar>
      {/* START SIDEBAR-OVERLAY: Close (x) */}
      <Sidebar.Close>
        <SidebarTrigger tag={'a'} href="#">
          <i className="fa fa-times-circle fa-fw"></i>
        </SidebarTrigger>
      </Sidebar.Close>
      {/* START SIDEBAR-OVERLAY: Close (x) */}

      {/* START SIDEBAR: Only for Desktop */}
      <Sidebar.HideSlim>
        <Sidebar.Section>
          <Link to="/" className="sidebar__brand">
            <LogoThemed checkBackground />
          </Link>
        </Sidebar.Section>
      </Sidebar.HideSlim>
      {/* END SIDEBAR: Only for Desktop */}

      {/* START SIDEBAR: Only for Mobile */}
      <Sidebar.MobileFluid>
        {/* <SidebarTopA /> */}
        <Sidebar.Section fluid cover>
          {/* SIDEBAR: Menu */}
          <Suspense fallback={<GluuSuspenseLoader />}>
            <GluuAppSidebar />
          </Suspense>
        </Sidebar.Section>
      </Sidebar.MobileFluid>
      {/* END SIDEBAR: Only for Mobile */}
    </Sidebar>
  )
}

export default DefaultSidebar
