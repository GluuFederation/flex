import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sidebar } from 'Components'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import GluuText from '@/routes/Apps/Gluu/GluuText'
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
      <div className="sidebar__hide-slim">
        <div className="sidebar__section">
          <Link to={ROUTES.ROOT} className="sidebar__brand">
            <LogoThemed />
          </Link>
        </div>
      </div>

      <div className="sidebar__mobile-fluid">
        <div className="sidebar__section sidebar__section--fluid sidebar__section--cover">
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
        </div>
      </div>
    </Sidebar>
  )
}

export { DefaultSidebar }

export default DefaultSidebar
