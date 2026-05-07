import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import logo from 'Images/logos/logo192.png'
import { Box } from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useAppSelector } from '@/redux/hooks'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import GenerateLicenseCard from './GenerateLicenseCard'
import useStyles from './LicenseScreen.style'

const ApiKey = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const serverError = useAppSelector((state) => state.licenseReducer.error)
  const isLoading = useAppSelector((state) => state.licenseReducer.isLoading)
  const generatingTrialKey = useAppSelector((state) => state.licenseReducer.generatingTrialKey)

  return (
    <GluuLoader blocking={isLoading || generatingTrialKey}>
      <div className={classes.container}>
        <div className={classes.row}>
          <div className={classes.logoSection}>
            <img src={logo} alt="Logo" className={`img-fluid ${classes.logo}`} />
          </div>
        </div>
        <div className={classes.row}>
          <Box className={classes.messageBlock}>
            <GluuText variant="h2" className={classes.title} disableThemeColor>
              {t('licenseScreen.welcomeTitle')}
            </GluuText>
          </Box>
        </div>
        <div className={classes.row}>
          <Box className={classes.messageBlock}>
            <GluuText className={classes.error} disableThemeColor>
              {serverError}
            </GluuText>
          </Box>
        </div>
        <Box className={classes.cardRow}>
          <Box className={`${classes.messageBlock} ${classes.cardWrapper}`}>
            <GenerateLicenseCard />
          </Box>
        </Box>
      </div>
    </GluuLoader>
  )
}
export default ApiKey
