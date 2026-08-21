import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components'
import { GluuModalShell } from '@/components/GluuModalShell'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { useStyles } from '../styles/PolicyStoreConfirmDialog.style'
import type { PolicyStoreConfirmDialogProps } from '../types'

const TITLE_ID = 'policy-store-confirm-title'

const PolicyStoreConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onClose,
}: PolicyStoreConfirmDialogProps) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const currentTheme = themeState?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })

  if (!open) {
    return null
  }

  return (
    <GluuModalShell onClose={onClose} ariaLabelledBy={TITLE_ID}>
      <GluuText variant="h2" className={classes.title} id={TITLE_ID}>
        {title}
      </GluuText>
      <GluuText variant="p" className={`${commitClasses.description} ${classes.description}`}>
        {message}
      </GluuText>
      <div className={`${commitClasses.buttonRow} ${classes.buttonRow}`}>
        <GluuButton
          onClick={onConfirm}
          backgroundColor={themeColors.formFooter.back.backgroundColor}
          textColor={themeColors.formFooter.back.textColor}
          borderColor="transparent"
          padding="8px 28px"
          minHeight="40"
          useOpacityOnHover
          className={commitClasses.yesButton}
        >
          {t('actions.yes')}
        </GluuButton>
      </div>
    </GluuModalShell>
  )
}

export default React.memo(PolicyStoreConfirmDialog)
