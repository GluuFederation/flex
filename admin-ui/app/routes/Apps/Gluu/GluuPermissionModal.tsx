import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const GluuPermissionModal = ({ handler, isOpen }: any) => {
  const { t } = useTranslation()

  return (
    <div>
      <Modal
        centered
        isOpen={isOpen}
        style={{ minWidth: '45vw' }}
        toggle={handler}
        className="modal-outline-primary"
        backdrop="static"
      >
        <ModalHeader>
          <i className="bi bi-shield-lock" /> {t('dashboard.access_denied')}
        </ModalHeader>
        <ModalBody className="text-center">
          <p className="text-muted">
            🚫 <strong>{t('dashboard.access_denied_message')}</strong>
          </p>
          <p>{t('dashboard.access_contact_admin')}</p>
        </ModalBody>
        <ModalFooter>
          <Button className="d-flex align-items-center" onClick={handler}>
            {t('menus.signout')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Scoped CSS inside the component */}
      <style>
        {`
          .modal {
            background: #000 !important;
          }
        `}
      </style>
    </div>
  )
}

export default GluuPermissionModal
