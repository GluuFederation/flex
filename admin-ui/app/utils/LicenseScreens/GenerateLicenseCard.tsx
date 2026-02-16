import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/redux/hooks'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import useStyles from '../styles/GenerateLicenseCard.style'
import { generateTrialLicense } from '../../redux/actions'
import GluuText from '../../routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'

function GenerateLicenseCard() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = useStyles({ themeColors })
  const generatingTrialKey = useAppSelector((state) => state.licenseReducer.generatingTrialKey)

  const handleGenerate = () => {
    dispatch(generateTrialLicense())
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <GluuText variant="div" className={classes.title}>
          {t('licenseCard.freeTrial')}
        </GluuText>
        <GluuText className={classes.description}>{t('licenseCard.description')}</GluuText>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <GluuButton
          type="button"
          disabled={generatingTrialKey}
          onClick={handleGenerate}
          className={classes.button}
          backgroundColor={themeColors.formFooter?.back?.backgroundColor}
          textColor={themeColors.formFooter?.back?.textColor}
        >
          {generatingTrialKey ? t('licenseCard.generating') : t('licenseCard.start30Days')}
        </GluuButton>
      </CardActions>
    </Card>
  )
}

export default GenerateLicenseCard
