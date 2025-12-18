import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import { Badge } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { AXIOS_INSTANCE } from '../../../../api-client'
import { getClientScopeByInum } from '../../../../app/utils/Util'

function ClientShowScopes({ handler, data, isOpen }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [fetchedScopes, setFetchedScopes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !data || data.length === 0) {
      setFetchedScopes([])
      return
    }

    const fetchScopesForClient = async () => {
      setLoading(true)

      const scopeInums = data
        .map((scopeDn) => getClientScopeByInum(scopeDn))
        .filter((inum) => inum !== null && inum !== undefined)

      if (scopeInums.length === 0) {
        setFetchedScopes([])
        setLoading(false)
        return
      }

      try {
        const response = await AXIOS_INSTANCE.get('/api/v1/scopes', {
          params: {
            pattern: scopeInums.join(','),
            limit: scopeInums.length,
          },
        })
        const scopeResults = response.data?.entries || response.data || []
        setFetchedScopes(Array.isArray(scopeResults) ? scopeResults : [])
      } catch (error) {
        console.error('Error fetching scopes:', error)
        setFetchedScopes([])
      }

      setLoading(false)
    }

    fetchScopesForClient()
  }, [isOpen, data])

  return (
    <Modal isOpen={isOpen} toggle={handler} className="modal-outline-primary">
      <ModalHeader>Scopes</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <Spinner color="primary" />
          </div>
        ) : fetchedScopes.length > 0 ? (
          fetchedScopes.map((scope, index) => (
            <div key={scope.inum || scope.id || index}>
              <Badge color={`primary-${selectedTheme}`}>{scope.id || scope.displayName}</Badge>
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
