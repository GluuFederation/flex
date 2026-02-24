import { memo, useContext, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalBody } from 'reactstrap'
import GluuText from './GluuText'
import { GluuButton } from '@/components/GluuButton'
import GluuFormFooter from './GluuFormFooter'
import {
  useStyles,
  getModalStyle,
  getFooterButtonStyles,
} from './styles/GluuScriptErrorModal.style'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'

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
  const modalStyle = useMemo(() => getModalStyle(themeColors), [themeColors])
  const footerButtonStyles = useMemo(() => getFooterButtonStyles(themeColors), [themeColors])

  const handleClose = useCallback(() => {
    setIsCopied(false)
    handler()
  }, [handler])

  const copyToClipboard = useCallback(() => {
    if (isCopied) return
    setIsCopied(true)
    navigator.clipboard.writeText(error)
  }, [error, isCopied])

  const cancelLabel = isCopied ? t('messages.copied') : t('actions.copy_to_clipboard')

  return (
    <Modal
      centered
      isOpen={isOpen}
      style={modalStyle}
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
          className={classes.closeButton}
          aria-label="Close"
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
          cancelButtonStyle={footerButtonStyles.cancelButtonStyle}
          cancelButtonClassName={classes.buttonHoverOpacity}
          cancelIconClass="fa fa-copy"
          showApply
          applyButtonType="button"
          applyButtonLabel={t('actions.close')}
          onApply={handleClose}
          applyButtonStyle={footerButtonStyles.applyButtonStyle}
          applyButtonClassName={classes.buttonHoverOpacity}
          applyIconClass="fa fa-times-circle"
        />
      </div>
    </Modal>
  )
}

export default memo(GluuScriptErrorModal)
