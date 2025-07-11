import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import { handleApiTimeout } from 'Redux/features/initSlice'
import { ThemeContext } from 'Context/theme/themeContext'

const GluuTimeoutModal = ({ description = '' }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isTimeout } = useSelector((state: any) => state.initReducer)
  const { authServerHost } = useSelector((state: any) => state.authReducer.config)
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  const handleRefresh = () => {
    dispatch(handleApiTimeout({ isTimeout: false }))

    const host = authServerHost ? `${authServerHost}/admin` : null
    if (host) {
      window.location.href = host
    } else {
      window.location.reload()
    }
  }

  const handler = useCallback(() => {
    dispatch(handleApiTimeout({ isTimeout: false }))
  }, [])

  return (
    <Modal
      centered
      isOpen={isTimeout}
      style={{ minWidth: '45vw' }}
      toggle={handler}
      className="modal-outline-primary"
    >
      <ModalBody style={{ overflowX: 'auto', maxHeight: '60vh' }}>
        <p>{description}</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handler}>{t('actions.close')}</Button>
        <Button onClick={handleRefresh} color={`primary-${selectedTheme}`}>
          {t('actions.try_again')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuTimeoutModal
