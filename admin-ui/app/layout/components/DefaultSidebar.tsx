import React, { Suspense, lazy } from 'react'
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
import type { DefaultSidebarProps } from './types'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar: React.FC<DefaultSidebarProps> = () => {
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

export { DefaultSidebar }

export default DefaultSidebar
