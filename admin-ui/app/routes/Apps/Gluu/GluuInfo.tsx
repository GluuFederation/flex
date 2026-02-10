import { useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ThemeContext } from 'Context/theme/themeContext'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'

interface GluuInfoItem {
  openModal: boolean
  testStatus: boolean
}

interface GluuInfoProps {
  item: GluuInfoItem
  handler: () => void
}

export default function GluuInfo({ item, handler }: GluuInfoProps) {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state.theme
  const { t } = useTranslation()

  return (
    <Modal isOpen={item.openModal} className="modal-outline-primary">
      <ModalHeader>
        <i
          style={{ color: customColors.accentRed }}
          className="fa fa-2x fa-item fa-fw modal-icon mb-3"
        ></i>
      </ModalHeader>
      <ModalBody>
        {item.testStatus ? (
          <p>{t('actions.server_success_stmp')}</p>
        ) : (
          <p>{t('actions.server_fails_smtp')}</p>
        )}
        {!item.testStatus && <p>{t('actions.server_code')}: 200</p>}
        {!item.testStatus && (
          <p>
            {t('actions.server_response')}: {item.testStatus ? 'true' : 'false'}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color={`primary-${selectedTheme}`}
          style={applicationStyle.buttonStyle}
          onClick={handler}
        >
          {t('actions.ok')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
