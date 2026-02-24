import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sidebar, SidebarTrigger } from 'Components'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import GluuText from '@/routes/Apps/Gluu/GluuText'
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
import { useStyles } from './DefaultSidebar.style'

const GluuAppSidebar = lazy(() => import('Routes/Apps/Gluu/GluuAppSidebar'))

const DefaultSidebar: React.FC<DefaultSidebarProps> = () => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  const { initialized, cedarFailedStatusAfterMaxTries } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const cedarConditionalLoader = () =>
    cedarFailedStatusAfterMaxTries && !initialized ? (
      <div className={classes.cedarMessageRoot}>
        <GluuText variant="p">{t('titles.no_Cedar')}</GluuText>
      </div>
    ) : (
      <div className={classes.sidebarLoaderRoot}>
        <GluuSuspenseLoader />
      </div>
    )

  return (
    <Sidebar>
      {/* START SIDEBAR-OVERLAY: Close (x) */}
      <SidebarClose>
        <SidebarTrigger tag={'a'} href="#">
          <i className="fa fa-times-circle fa-fw" />
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
            <Suspense
              fallback={
                <div className={classes.sidebarLoaderRoot}>
                  <GluuSuspenseLoader />
                </div>
              }
            >
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
