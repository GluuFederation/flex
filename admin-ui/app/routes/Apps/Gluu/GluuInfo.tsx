import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircleOutline, HighlightOffOutlined } from '@/components/icons'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import { GluuModalShell } from '@/components/GluuModalShell'
import { useStyles } from './styles/GluuInfo.style'

type GluuInfoItem = {
  openModal: boolean
  testStatus: boolean
}

type GluuInfoProps = {
  item: GluuInfoItem
  handler: () => void
}

const GluuInfo = ({ item, handler }: GluuInfoProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })

  if (!item.openModal) return null

  return (
    <GluuModalShell onClose={handler} ariaLabelledBy="gluu-info-title">
      <GluuText variant="h2" className={classes.title} id="gluu-info-title">
        {t('titles.smtp_test_result')}
      </GluuText>
      <div className={classes.statusRow}>
        {item.testStatus ? (
          <CheckCircleOutline fontSize="large" style={{ color: themeColors.badges.statusActive }} />
        ) : (
          <HighlightOffOutlined
            fontSize="large"
            style={{ color: themeColors.settings.removeButton.bg }}
          />
        )}
        <GluuText variant="p" className={classes.statusMessage}>
          {item.testStatus ? t('actions.server_success_smtp') : t('actions.server_fails_smtp')}
        </GluuText>
      </div>
      {!item.testStatus && (
        <GluuText variant="p" className={classes.detailText}>
          {t('actions.server_response')}: {t('actions.server_fails_smtp')}
        </GluuText>
      )}
      <div>
        <GluuButton
          onClick={handler}
          backgroundColor={themeColors.formFooter.back.backgroundColor}
          textColor={themeColors.formFooter.back.textColor}
          borderColor="transparent"
          padding="8px 28px"
          minHeight="40"
          useOpacityOnHover
        >
          {t('actions.ok')}
        </GluuButton>
      </div>
    </GluuModalShell>
  )
}

export default GluuInfo
