import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sidebar, SidebarTrigger } from 'Components'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuSidebarLoader from 'Routes/Apps/Gluu/GluuSidebarLoader'
import {
  SidebarClose,
  SidebarHideSlim,
  SidebarMobileFluid,
  SidebarSection,
} from '@/components/Sidebar'
import type { DefaultSidebarProps } from './types'
import { useTranslation } from 'react-i18next'
import { RootState } from '@/cedarling'
import { ROUTES } from '@/helpers/navigation'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar: React.FC<DefaultSidebarProps> = () => {
  const { t } = useTranslation()

  const { initialized, cedarFailedStatusAfterMaxTries } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const cedarConditionalLoader = () =>
    cedarFailedStatusAfterMaxTries && !initialized ? (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: 200,
          padding: 20,
        }}
      >
        <p>{t('titles.no_Cedar')}</p>
      </div>
    ) : (
      <GluuSidebarLoader />
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
          <Link to={ROUTES.ROOT} className="sidebar__brand">
            <LogoThemed />
          </Link>
        </SidebarSection>
      </SidebarHideSlim>
      {/* END SIDEBAR: Only for Desktop */}

      {/* START SIDEBAR: Only for Mobile */}
      <SidebarMobileFluid>
        <SidebarSection fluid cover>
          {initialized ? (
            <Suspense fallback={<GluuSidebarLoader />}>
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
