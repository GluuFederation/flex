import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Badge } from 'Components'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'

function ClientShowSpontaneousScopes({ handler, isOpen }) {
  const { t } = useTranslation()
  const scopesByCreator = useSelector((state) => state.scopeReducer.scopesByCreator)

  const printableScopes = scopesByCreator.filter((item) => item.scopeType == 'spontaneous')
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: customColors.white,
      marginBottom: '4px',
    }),
    [themeColors.background],
  )

  const buttonStyle = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: themeColors.fontColor,
      border: 'none',
    }),
    [themeColors.background, themeColors.fontColor],
  )

  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader style={{ color: customColors.black }}>
        {t('fields.spontaneousScopes')}
      </ModalHeader>
      <ModalBody>
        {printableScopes.length > 0 ? (
          printableScopes?.map((scope, key) => {
            return (
              <div key={key}>
                <Badge style={badgeStyle}>{scope?.id}</Badge>
              </div>
            )
          })
        ) : (
          <div style={{ color: customColors.black }}>
            {t('messages.no_scope_in_spontaneous_client')}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button style={buttonStyle} onClick={handler}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
export default ClientShowSpontaneousScopes
