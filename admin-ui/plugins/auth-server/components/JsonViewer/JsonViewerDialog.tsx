import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import JsonViewer from './JsonViewer'
import customColors from '@/customColors'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { THEME_LIGHT, type ThemeValue } from '@/context/theme/constants'

interface JsonViewerDialogProps {
  isOpen: boolean
  toggle: () => void
  data?: unknown
  isLoading?: boolean
  title?: string
  theme?: ThemeValue
  expanded?: boolean
}

const JsonViewerDialog: React.FC<JsonViewerDialogProps> = ({
  isOpen,
  toggle,
  data,
  isLoading = false,
  title = 'JSON Viewer',
  theme = THEME_LIGHT,
  expanded = true,
}) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className="modal-outline-primary">
      <ModalHeader toggle={toggle}>
        <i
          style={{ color: customColors.logo }}
          className="fa fa-2x fa-code fa-fw modal-icon mb-3"
        />
        {title}
      </ModalHeader>
      <ModalBody style={{ maxHeight: '70vh', overflow: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <i className="fa fa-spinner fa-spin fa-2x" style={{ color: customColors.logo }} />
            <p style={{ marginTop: '1rem', color: '#666' }}>
              {t('messages.request_waiting_message')}
            </p>
          </div>
        ) : data ? (
          <JsonViewer data={data} theme={theme} expanded={expanded} />
        ) : null}
      </ModalBody>
      <ModalFooter className="w-100">
        <GluuFormFooter
          showBack={true}
          onBack={toggle}
          showCancel={false}
          showApply={false}
          disableBack={false}
          className="w-100"
          backButtonLabel={t('actions.close')}
          backIconClass="fa fa-times-circle"
        />
      </ModalFooter>
    </Modal>
  )
}

JsonViewerDialog.displayName = 'JsonViewerDialog'

export default JsonViewerDialog
