import React, { useContext, useMemo } from 'react'
import { Container } from 'Components'
import { useTranslation } from 'react-i18next'
import ApiKey from './LicenseScreens/ApiKey'
import GluuErrorModal from '../routes/Apps/Gluu/GluuErrorModal'
import UploadSSA from './UploadSSA'
import { useAppSelector } from '@/redux/hooks'
import GluuServiceDownModal from '../routes/Apps/Gluu/GluuServiceDownModal'
import loaderGif from 'Images/gif/loader.gif'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import useStyles from './styles/ApiKeyRedirect.style'

type ApiKeyRedirectProps = {
  isLicenseValid: boolean
  islicenseCheckResultLoaded: boolean
  roleNotFound: boolean
  isConfigValid: boolean | null
}

function ApiKeyRedirect({
  isLicenseValid,
  islicenseCheckResultLoaded,
  roleNotFound,
  isConfigValid,
}: ApiKeyRedirectProps) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const { isTimeout } = useAppSelector((state) => state.initReducer)
  const { isValidatingFlow, isNoValidLicenseKeyFound, isUnderThresholdLimit } = useAppSelector(
    (state) => state.licenseReducer,
  )
  const backendStatus = useAppSelector((state) => state.authReducer.backendStatus)

  const showRedirectingLoader =
    isConfigValid !== false &&
    !isTimeout &&
    isUnderThresholdLimit &&
    backendStatus.active &&
    !(
      !isLicenseValid &&
      islicenseCheckResultLoaded &&
      isConfigValid &&
      !isValidatingFlow &&
      isNoValidLicenseKeyFound
    )

  if (showRedirectingLoader) {
    return (
      <>
        <div className={classes.redirectingScreen} aria-live="polite" aria-busy="true">
          <img className={classes.loaderImage} src={loaderGif} alt="" />
          <div className={`initial-loader__row ${classes.redirectingText}`}>Redirecting...</div>
        </div>
        {!backendStatus.active && (
          <GluuServiceDownModal
            statusCode={backendStatus.statusCode ?? undefined}
            message={
              backendStatus.errorMessage ||
              'Gluu Flex Admin UI is not getting any response from the backend (Jans Config Api).'
            }
          />
        )}
        {roleNotFound && (
          <GluuErrorModal
            message={t('Unauthorized User')}
            description={'The logged-in user do not have valid role. Logging out of Admin UI'}
          />
        )}
      </>
    )
  }

  return (
    <React.Fragment>
      <Container>
        {isConfigValid == false ? (
          <UploadSSA />
        ) : !isTimeout && isUnderThresholdLimit ? (
          !isLicenseValid &&
          islicenseCheckResultLoaded &&
          isConfigValid &&
          !isValidatingFlow &&
          isNoValidLicenseKeyFound ? (
            <ApiKey />
          ) : null
        ) : null}

        {!backendStatus.active && (
          <GluuServiceDownModal
            statusCode={backendStatus.statusCode ?? undefined}
            message={
              backendStatus.errorMessage ||
              'Gluu Flex Admin UI is not getting any response from the backend (Jans Config Api).'
            }
          />
        )}

        {roleNotFound && (
          <GluuErrorModal
            message={t('Unauthorized User')}
            description={'The logged-in user do not have valid role. Logging out of Admin UI'}
          />
        )}
      </Container>
    </React.Fragment>
  )
}
export default ApiKeyRedirect
