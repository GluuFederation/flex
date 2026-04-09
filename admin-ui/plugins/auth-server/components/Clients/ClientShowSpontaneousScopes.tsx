import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Badge } from 'Components'
import { useAppSelector } from '@/redux/hooks'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'
import { SPONTANEOUS_SCOPE_TYPE } from './constants'
import type { ClientShowSpontaneousScopesProps } from './types'

const ClientShowSpontaneousScopes = ({
  handler,
  isOpen,
}: ClientShowSpontaneousScopesProps): JSX.Element => {
  const { t } = useTranslation()
  const scopesByCreator = useAppSelector((state) => state.scopeReducer?.scopesByCreator ?? [])

  const printableScopes = useMemo(
    () => scopesByCreator.filter((item) => item.scopeType === SPONTANEOUS_SCOPE_TYPE),
    [scopesByCreator],
  )

  const themeCtx = useContext(ThemeContext) as { state?: { theme?: string } }
  const selectedTheme = themeCtx?.state?.theme || DEFAULT_THEME
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
          printableScopes.map((scope, key) => (
            <div key={scope.inum ?? `spontaneous-${key}`}>
              <Badge style={badgeStyle}>{scope?.id}</Badge>
            </div>
          ))
        ) : (
          <div style={{ color: customColors.black }}>
            {t('messages.no_scope_in_spontaneous_client')}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button style={buttonStyle} onClick={handler}>
          {t('actions.close')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ClientShowSpontaneousScopes
