// @ts-nocheck
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import PropTypes from 'prop-types'

const GluuViewDetailModal = ({ children, isOpen, handleClose }) => {
    const { t } = useTranslation()
    return (
        <Modal
            centered
            isOpen={isOpen}
            style={{ minWidth: '70vw' }}
            toggle={handleClose}
            className='modal-outline-primary'
        >
            <ModalHeader>{t('messages.2FA_details')}</ModalHeader>
            <ModalBody style={{ overflowX: 'auto', maxHeight: '60vh' }}>
                {children}
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleClose}>{t('actions.close')}</Button>
            </ModalFooter>
        </Modal>
    )
}

GluuViewDetailModal.propTypes = {
    children: PropTypes.any,
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
  };

export default GluuViewDetailModal