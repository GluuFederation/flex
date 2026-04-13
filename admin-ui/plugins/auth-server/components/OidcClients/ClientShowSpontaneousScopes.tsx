import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Badge } from 'Components'
import { useGetScopeByCreator } from 'JansConfigApi'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { SPONTANEOUS_SCOPE_TYPE } from './constants'
import { useStyles } from './styles/ClientShowSpontaneousScopes.style'
import type { ClientShowSpontaneousScopesProps } from './types'

const ClientShowSpontaneousScopes = ({
  handler,
  isOpen,
  clientInum,
}: ClientShowSpontaneousScopesProps): JSX.Element => {
  const { t } = useTranslation()
  const { data: scopesByCreator } = useGetScopeByCreator(clientInum ?? '', {
    query: { enabled: !!clientInum },
  })

  const printableScopes = useMemo(
    () => (scopesByCreator ?? []).filter((item) => item.scopeType === SPONTANEOUS_SCOPE_TYPE),
    [scopesByCreator],
  )

  const themeCtx = useContext(ThemeContext) as { state?: { theme?: string } }
  const selectedTheme = themeCtx?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors })

  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader className={classes.modalTitle}>{t('fields.spontaneousScopes')}</ModalHeader>
      <ModalBody>
        {printableScopes.length > 0 ? (
          printableScopes.map((scope, key) => (
            <div key={scope.inum ?? `spontaneous-${key}`}>
              <Badge className={classes.badge}>{scope?.id}</Badge>
            </div>
          ))
        ) : (
          <div className={classes.emptyState}>{t('messages.no_scope_in_spontaneous_client')}</div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button className={classes.closeButton} onClick={handler}>
          {t('actions.close')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ClientShowSpontaneousScopes
