import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import { GluuBadge, GluuButton } from 'Components'
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

  const scopeInums = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }
    return data.map((scopeDn) => getClientScopeByInum(scopeDn)).filter(Boolean)
  }, [data])

  const {
    data: scopesResponse,
    isLoading,
    isFetching,
  } = useGetOauthScopes(
    {
      pattern: scopeInums.join(','),
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
            <div key={scope.inum || scope.id || index} style={{ marginBottom: 4 }}>
              <GluuBadge>{scope.displayName || scope.id}</GluuBadge>
            </div>
          ))
        ) : (
          <div>{t('messages.no_scope_in_client')}</div>
        )}
      </ModalBody>
      <ModalFooter>
        <GluuButton onClick={handler}>{t('actions.close')}</GluuButton>
      </ModalFooter>
    </Modal>
  )
}

export default ClientShowScopes
