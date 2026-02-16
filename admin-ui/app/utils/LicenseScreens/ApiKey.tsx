import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import logo from 'Images/logos/logo192.png'
import { Box } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useAppSelector } from '@/redux/hooks'
import useStyles from '../styles/LicenseScreen.style'
import GenerateLicenseCard from './GenerateLicenseCard'
import GluuText from '../../routes/Apps/Gluu/GluuText'

function ApiKey() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const serverError = useAppSelector((state) => state.licenseReducer.error)
  const isLoading = useAppSelector((state) => state.licenseReducer.isLoading)
  const generatingTrialKey = useAppSelector((state) => state.licenseReducer.generatingTrialKey)

  return (
    <div>
      {(isLoading || generatingTrialKey) && (
        <div className={classes.loaderOuter}>
          <div className={classes.loader} />
        </div>
      )}
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <img src={logo} alt="Logo" className={`img-fluid ${classes.logo}`} />
          </div>
        </div>
        <div className="row">
          <Box className="col-md-8 text-center mx-auto mb-3">
            <GluuText variant="h2" className={classes.title} disableThemeColor>
              {t('licenseScreen.welcomeTitle')}
            </GluuText>
          </Box>
        </div>
        <div className="row">
          <Box className={`col-md-8 text-center mx-auto mb-3 ${classes.error}`}>
            <GluuText>{serverError}</GluuText>
          </Box>
        </div>
        <Box className="row mt-3">
          <Box className={`mx-auto col-md-8 ${classes.cardWrapper}`}>
            <GenerateLicenseCard />
          </Box>
        </Box>
      </div>
    </div>
  )
}
export default ApiKey
