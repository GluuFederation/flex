import { memo, useContext, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalBody } from 'reactstrap'
import GluuText from './GluuText'
import { GluuButton } from '@/components/GluuButton'
import GluuFormFooter from './GluuFormFooter'
import { useStyles } from './styles/GluuScriptErrorModal.style'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { devLogger } from '@/utils/devLogger'

interface GluuScriptErrorModalProps {
  title?: string
  error: string
  isOpen: boolean
  handler: () => void
}

const GluuScriptErrorModal = ({
  title = 'Error',
  error,
  isOpen,
  handler,
}: GluuScriptErrorModalProps) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const [isCopied, setIsCopied] = useState(false)
  const selectedTheme = theme?.state.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors })

  const handleClose = useCallback(() => {
    setIsCopied(false)
    handler()
  }, [handler])

  const copyToClipboard = useCallback(async () => {
    if (isCopied) return
    try {
      await navigator.clipboard.writeText(error)
      setIsCopied(true)
    } catch (clipboardError) {
      devLogger.error('Failed to copy script error to clipboard:', clipboardError)
    }
  }, [error, isCopied])

  const cancelLabel = isCopied ? t('messages.copied') : t('actions.copy_to_clipboard')

  return (
    <Modal
      centered
      isOpen={isOpen}
      toggle={handleClose}
      className="modal-outline-primary"
      modalClassName={classes.modalWrapper}
    >
      <div className={classes.header}>
        <GluuText variant="h5" disableThemeColor className={classes.titleText}>
          {title}
        </GluuText>
        <GluuButton
          type="button"
          size="sm"
          onClick={handleClose}
          className={`${classes.closeButton} ${classes.buttonHoverOpacity}`}
          aria-label={t('actions.close')}
          backgroundColor="transparent"
          borderColor="transparent"
          textColor={themeColors.fontColor}
        >
          <i className="fa fa-times" aria-hidden />
        </GluuButton>
      </div>
      <ModalBody className={classes.body}>
        <GluuText variant="p" disableThemeColor className={classes.errorText}>
          {error}
        </GluuText>
      </ModalBody>
      <div className={classes.footer}>
        <GluuFormFooter
          showCancel
          cancelButtonLabel={cancelLabel}
          onCancel={copyToClipboard}
          disableCancel={isCopied}
          cancelButtonClassName={classes.cancelButton}
          cancelIconClass="fa fa-copy"
          showApply
          applyButtonType="button"
          applyButtonLabel={t('actions.close')}
          onApply={handleClose}
          applyButtonClassName={classes.applyButton}
          applyIconClass="fa fa-times-circle"
        />
      </div>
    </Modal>
  )
}

export default memo(GluuScriptErrorModal)
