import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

interface GluuViewDetailModalProps {
  isOpen: boolean
  handleClose: () => void
  children: React.ReactNode
  hideFooter?: boolean
  title?: string
  contentClassName?: string
  contentStyle?: React.CSSProperties
  headerClassName?: string
  headerStyle?: React.CSSProperties
  modalClassName?: string
  modalStyle?: React.CSSProperties
  /** Custom header content - when provided, replaces default ModalHeader (for layout like 2FA: close on row 1, title on row 2) */
  customHeader?: React.ReactNode
}

const GluuViewDetailModal = ({
  children,
  isOpen,
  handleClose,
  hideFooter = false,
  title,
  contentClassName = '',
  contentStyle,
  headerClassName = '',
  headerStyle,
  modalClassName = '',
  modalStyle,
  customHeader,
}: GluuViewDetailModalProps) => {
  const { t } = useTranslation()
  const displayTitle = title ?? t('messages.2FA_details')
  return (
    <Modal
      centered
      isOpen={isOpen}
      style={{ minWidth: '70vw', ...modalStyle }}
      toggle={handleClose}
      className={`modal-outline-primary ${modalClassName}`.trim()}
    >
      {customHeader ?? (
        <ModalHeader toggle={handleClose} className={headerClassName} style={headerStyle}>
          {displayTitle}
        </ModalHeader>
      )}
      <ModalBody
        className={contentClassName}
        style={{ overflowX: 'auto', maxHeight: '60vh', ...contentStyle }}
      >
        {children}
      </ModalBody>
      {!hideFooter && (
        <ModalFooter>
          <Button onClick={handleClose}>{t('actions.close')}</Button>
        </ModalFooter>
      )}
    </Modal>
  )
}
export default GluuViewDetailModal
