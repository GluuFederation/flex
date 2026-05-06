import { useMemo } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { CheckCircleOutline, HighlightOffOutlined } from '@/components/icons'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import GluuText from './GluuText'
import { GluuButton } from '@/components'
import { useStyles } from './styles/GluuInfo.style'

interface GluuInfoItem {
  openModal: boolean
  testStatus: boolean
}

interface GluuInfoProps {
  item: GluuInfoItem
  handler: () => void
}

const GluuInfo = ({ item, handler }: GluuInfoProps) => {
  const { state: themeState } = useTheme()
  const isDark = themeState.theme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { t } = useTranslation()
  const { classes } = useStyles({ isDark, themeColors })

  return (
    <Modal isOpen={item.openModal} toggle={handler} className="modal-outline-primary">
      <ModalHeader toggle={handler} className={classes.modalHeader}>
        <GluuText variant="span" className={classes.title}>
          {t('titles.smtp_test_result')}
        </GluuText>
      </ModalHeader>
      <ModalBody className={classes.modalBody}>
        <div className={classes.statusRow}>
          {item.testStatus ? (
            <CheckCircleOutline
              fontSize="large"
              style={{ color: themeColors.badges.statusActive }}
            />
          ) : (
            <HighlightOffOutlined
              fontSize="large"
              style={{ color: themeColors.settings.removeButton.bg }}
            />
          )}
          <GluuText variant="p" className={classes.statusMessage}>
            {item.testStatus ? t('actions.server_success_smtp') : t('actions.server_fails_smtp')}
          </GluuText>
        </div>
        {!item.testStatus && (
          <GluuText variant="p" className={classes.detailText}>
            {t('actions.server_response')}: {t('actions.server_fails_smtp')}
          </GluuText>
        )}
      </ModalBody>
      <ModalFooter className={classes.modalFooter}>
        <GluuButton
          onClick={handler}
          backgroundColor={themeColors.formFooter.back.backgroundColor}
          textColor={themeColors.formFooter.back.textColor}
          borderColor="transparent"
          padding="8px 28px"
          minHeight="40"
          useOpacityOnHover
        >
          {t('actions.ok')}
        </GluuButton>
      </ModalFooter>
    </Modal>
  )
}

export default GluuInfo
