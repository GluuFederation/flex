import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { handleApiTimeout } from 'Redux/features/initSlice'

const GluuTimeoutModal = ({ description = '' }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isTimeout } = useSelector((state) => state.initReducer)

  const handler = useCallback(() => {
    dispatch(handleApiTimeout({ isTimeout: false }))
  }, [])

  return (
    <Modal
      centered
      isOpen={isTimeout}
      style={{ minWidth: '45vw' }}
      toggle={handler}
      className='modal-outline-primary'
    >
      <ModalBody style={{ overflowX: 'auto', maxHeight: '60vh' }}>
        <p>{description}</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handler}>{t('actions.ok')}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuTimeoutModal