import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
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
import { useTranslation } from 'react-i18next'
import { RootState } from '@/cedarling'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar: React.FC<DefaultSidebarProps> = () => {
  const { t } = useTranslation()

  const cedarlingInitialized = useSelector((state: RootState) => state.cedarPermissions.initialized)

  const cedarConditionalLoader = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: window.innerHeight * 0.9,
        padding: '20px',
      }}
    >
      {cedarlingInitialized ? <p>{t('titles.no_Cedar')}</p> : <GluuSuspenseLoader />}
    </div>
  )

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
          {cedarlingInitialized ? (
            <Suspense fallback={<GluuSuspenseLoader />}>
              <GluuAppSidebar />
            </Suspense>
          ) : (
            cedarConditionalLoader()
          )}
        </SidebarSection>
      </SidebarMobileFluid>
      {/* END SIDEBAR: Only for Mobile */}
    </Sidebar>
  )
}

export { DefaultSidebar }

export default DefaultSidebar
