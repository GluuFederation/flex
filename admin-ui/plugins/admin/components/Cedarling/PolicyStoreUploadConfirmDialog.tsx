import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { ModalLayer } from '@/components/ModalLayer'
import { Close } from '@/components/icons'
import { GluuButton } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useStyles as useCommitDialogStyles } from 'Routes/Apps/Gluu/styles/GluuCommitDialog.style'
import { useStyles } from './PolicyStoreUploadConfirmDialog.style'
import type { PolicyStoreUploadConfirmDialogProps } from './types'

const PolicyStoreUploadConfirmDialog: React.FC<PolicyStoreUploadConfirmDialogProps> = ({
  open,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes: commitClasses } = useCommitDialogStyles({ isDark, themeColors })
  const { classes } = useStyles({ isDark, themeColors })
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus()
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    },
    [onClose],
  )

  if (!open) {
    return null
  }

  return createPortal(
    <ModalLayer onClose={onClose}>
      <div
        ref={dialogRef}
        className={commitClasses.modalContainer}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="confirm-upload-title"
        style={{ outline: 'none' }}
      >
        <button
          type="button"
          onClick={onClose}
          className={commitClasses.closeButton}
          aria-label={t('actions.close')}
          title={t('actions.close')}
        >
          <Close fontSize="small" aria-hidden />
        </button>
        <div className={`${commitClasses.contentArea} ${classes.contentArea}`}>
          <GluuText variant="h2" className={classes.title} id="confirm-upload-title">
            {t('documentation.cedarlingConfig.uploadConfirmTitle')}
          </GluuText>
          <GluuText variant="p" className={`${commitClasses.description} ${classes.description}`}>
            {t('documentation.cedarlingConfig.uploadConfirmMessage')}
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
        </div>
      </div>
    </ModalLayer>,
    document.body,
  )
}

export default PolicyStoreUploadConfirmDialog
