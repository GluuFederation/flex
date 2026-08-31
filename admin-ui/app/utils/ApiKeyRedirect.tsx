import React, { lazy, Suspense, use, useMemo } from 'react'
import { Container, ApiKey } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuText from '../routes/Apps/Gluu/GluuText'
import GluuLoader from '../routes/Apps/Gluu/GluuLoader'
import { useAppSelector } from '@/redux/hooks'
import GluuServiceDownModal from '../routes/Apps/Gluu/GluuServiceDownModal'
import loaderGif from 'Images/gif/loader.gif'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import useStyles from './styles/ApiKeyRedirect.style'

const UploadSSA = lazy(() => import('./UploadSSA'))

type ApiKeyRedirectProps = {
  isLicenseValid: boolean
  islicenseCheckResultLoaded: boolean
  isConfigValid: boolean | null
}

const ApiKeyRedirect = ({
  isLicenseValid,
  islicenseCheckResultLoaded,
  isConfigValid,
}: ApiKeyRedirectProps) => {
  const { t } = useTranslation()
  const theme = use(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const { isTimeout, isSessionExpired } = useAppSelector((state) => state.initReducer)
  const { isValidatingFlow, isNoValidLicenseKeyFound, isUnderThresholdLimit } = useAppSelector(
    (state) => state.licenseReducer,
  )
  const backendStatus = useAppSelector((state) => state.authReducer.backendStatus)

  const shouldShowApiKey =
    !isLicenseValid &&
    islicenseCheckResultLoaded &&
    isConfigValid &&
    !isValidatingFlow &&
    isNoValidLicenseKeyFound

  // An expired session leaves isConfigValid unresolved, so the loader must yield to the modal
  // instead of spinning forever waiting for an answer that needs a fresh sign-in.
  const showRedirectingLoader =
    !isSessionExpired &&
    isConfigValid !== false &&
    (!islicenseCheckResultLoaded ||
      isConfigValid === null ||
      (!isTimeout && isUnderThresholdLimit && backendStatus.active && !shouldShowApiKey))

  if (showRedirectingLoader) {
    return (
      <div className={classes.redirectingScreen} aria-live="polite" aria-busy="true">
        <img className={classes.loaderImage} src={loaderGif} alt="" />
        <GluuText className={`initial-loader__row ${classes.redirectingText}`}>
          {t('licenseScreen.redirecting')}
        </GluuText>
      </div>
    )
  }

  return (
    <React.Fragment>
      <Container>
        {/* Auth state is settled first: an expired session is handled by GluuTimeoutModal and
            must never be mistaken for an invalid config, which would prompt for an SSA upload. */}
        {isSessionExpired ? null : isConfigValid === false && backendStatus.active ? (
          <Suspense fallback={<GluuLoader blocking />}>
            <UploadSSA />
          </Suspense>
        ) : isConfigValid === false ? null : !isTimeout && isUnderThresholdLimit ? (
          shouldShowApiKey ? (
            <ApiKey />
          ) : null
        ) : null}

        {!isSessionExpired && !backendStatus.active && (
          <GluuServiceDownModal
            statusCode={backendStatus.statusCode ?? undefined}
            message={backendStatus.errorMessage || t('serviceDownFallback')}
          />
        )}
      </Container>
    </React.Fragment>
  )
}
export default ApiKeyRedirect
