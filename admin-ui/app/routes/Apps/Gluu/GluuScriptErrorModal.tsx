import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import applicationstyle from './styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
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
  const selectedTheme = theme?.state.theme || DEFAULT_THEME

  const copyToClipboard = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(error)
    setTimeout(() => {
      setIsCopied(false)
    }, 6000)
  }

  return (
    <Modal
      centered
      isOpen={isOpen}
      style={{ minWidth: '45vw' }}
      toggle={handler}
      className="modal-outline-primary"
    >
      <ModalHeader style={{ padding: '16px' }} toggle={handler}>
        <h4 style={{ fontWeight: 500 }}>{title}</h4>
      </ModalHeader>
      <ModalBody style={{ overflowX: 'auto', maxHeight: '60vh' }}>
        <p>{error}</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => !isCopied && copyToClipboard()}>
          {isCopied ? <>{t('messages.copied')}</> : <>{t('actions.copy_to_clipboard')}</>}
        </Button>
        <Button
          color={`primary-${selectedTheme}`}
          style={applicationstyle.buttonStyle}
          onClick={handler}
        >
          {t('actions.close')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default GluuScriptErrorModal
