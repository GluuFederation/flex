import React, { Suspense, lazy, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, SidebarTrigger } from 'Components'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import {
  SidebarClose,
  SidebarHideSlim,
  SidebarMobileFluid,
  SidebarSection,
} from '@/components/Sidebar'
import { useCedarling } from '@/cedarling'
import { useSelector } from 'react-redux'
import {
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
} from '@/utils/PermChecker'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar: React.FC = () => {
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
    // testAuth()
  }, [token])
  return (
    <Sidebar>
      {/* START SIDEBAR-OVERLAY: Close (x) */}
      <SidebarClose>
        <SidebarTrigger tag={'a'} href="#">
          <i className="fa fa-times-circle fa-fw"></i>
        </SidebarTrigger>
      </SidebarClose>
      {/* START SIDEBAR-OVERLAY: Close (x) */}

      {/* START SIDEBAR: Only for Desktop */}
      <SidebarHideSlim>
        <SidebarSection>
          <Link to="/" className="sidebar__brand">
            <LogoThemed checkBackground className="sidebar__brand" />
          </Link>
        </SidebarSection>
      </SidebarHideSlim>
      {/* END SIDEBAR: Only for Desktop */}

      {/* START SIDEBAR: Only for Mobile */}
      <SidebarMobileFluid>
        {/* <SidebarTopA /> */}
        <SidebarSection fluid cover>
          {/* SIDEBAR: Menu */}
          <Suspense fallback={<GluuSuspenseLoader />}>
            <GluuAppSidebar />
          </Suspense>
        </SidebarSection>
      </SidebarMobileFluid>
      {/* END SIDEBAR: Only for Mobile */}
    </Sidebar>
  )
}

export default DefaultSidebar
