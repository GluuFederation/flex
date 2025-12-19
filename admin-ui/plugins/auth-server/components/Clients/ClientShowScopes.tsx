import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import { Badge } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { getClientScopeByInum } from '../../../../app/utils/Util'
import { useGetOauthScopes } from 'JansConfigApi'
import type { Scope } from 'JansConfigApi'

interface ClientShowScopesProps {
  handler: () => void
  data: string[]
  isOpen: boolean
}

function ClientShowScopes({ handler, data, isOpen }: ClientShowScopesProps): React.ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'

  const scopeInums = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }
    return data
      .map((scopeDn) => getClientScopeByInum(scopeDn))
      .filter((inum) => inum !== null && inum !== undefined && inum !== '')
  }, [data])

  const {
    data: scopesResponse,
    isLoading,
    isFetching,
  } = useGetOauthScopes(
    {
      pattern: scopeInums.join(','),
      limit: scopeInums.length || 10,
    },
    {
      query: {
        enabled: isOpen && scopeInums.length > 0,
      },
    },
  )

  const loading = isLoading || isFetching
  const fetchedScopes: Scope[] = (scopesResponse?.entries as Scope[]) ?? []

  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader>{t('fields.scopes')}</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : fetchedScopes.length > 0 ? (
          fetchedScopes.map((scope, index) => (
            <div key={scope.inum || scope.id || index}>
              <Badge color={`primary-${selectedTheme}`}>{scope.displayName || scope.id}</Badge>
            </div>
          ))
        ) : (
          <div>{t('messages.no_scope_in_client')}</div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color={`primary-${selectedTheme}`} onClick={handler}>
          {t('actions.close')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ClientShowScopes
