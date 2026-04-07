import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import type { GluuViewDetailModalProps } from './types'

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
  const displayTitle = title ?? t('messages.details')
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
