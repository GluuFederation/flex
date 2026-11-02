import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuText from './GluuText'
import { GluuButton } from '@/components/GluuButton'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './styles/GluuLoadError.style'

type GluuLoadErrorProps = {
  message: string
  onRetry: () => void
}

const GluuLoadError = ({ message, onRetry }: GluuLoadErrorProps) => {
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])

  return (
    <div role="alert" className={classes.root}>
      <GluuText variant="span" disableThemeColor className={classes.message}>
        {message}
      </GluuText>
      <GluuButton
        onClick={onRetry}
        backgroundColor={themeColors.formFooter.back.backgroundColor}
        textColor={themeColors.formFooter.back.textColor}
        borderColor={themeColors.formFooter.back.borderColor}
        padding="8px 28px"
      >
        {t('actions.try_again')}
      </GluuButton>
    </div>
  )
}

export default GluuLoadError
