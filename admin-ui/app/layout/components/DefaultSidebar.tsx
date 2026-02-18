import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'
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
import { ROUTES } from '@/helpers/navigation'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar: React.FC<DefaultSidebarProps> = () => {
  const { t } = useTranslation()

  const { initialized, cedarFailedStatusAfterMaxTries } = useAppSelector(
    (state) => state.cedarPermissions,
  )

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
      {cedarFailedStatusAfterMaxTries && !initialized ? (
        <p>{t('titles.no_Cedar')}</p>
      ) : (
        <GluuSuspenseLoader />
      )}
    </div>
  )

  return (
    <Sidebar>
      <SidebarClose>
        <SidebarTrigger tag={'a'} href="#">
          <i className="fa fa-times-circle fa-fw" />
        </SidebarTrigger>
      </SidebarClose>
      <SidebarHideSlim>
        <SidebarSection>
          <Link to={ROUTES.ROOT} className="sidebar__brand">
            <LogoThemed />
          </Link>
        </SidebarSection>
      </SidebarHideSlim>
      <SidebarMobileFluid>
        <SidebarSection fluid cover>
          {initialized ? (
            <Suspense fallback={<GluuSuspenseLoader />}>
              <GluuAppSidebar />
            </Suspense>
          ) : (
            cedarConditionalLoader()
          )}
        </SidebarSection>
      </SidebarMobileFluid>
    </Sidebar>
  )
}

export { DefaultSidebar }

export default DefaultSidebar
