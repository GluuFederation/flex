import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import JsonViewer from './JsonViewer'
import PropTypes from 'prop-types'
import customColors from '@/customColors'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'

const JsonViewerDialog = ({
  isOpen,
  toggle,
  data,
  title = 'JSON Viewer',
  theme = 'light',
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
        <JsonViewer data={data} theme={theme} expanded={expanded} />
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

JsonViewerDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
  theme: PropTypes.string,
  expanded: PropTypes.bool,
}

export default JsonViewerDialog
