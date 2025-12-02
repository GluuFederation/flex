import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import SetTitle from 'Utils/SetTitle'
import { useClientActions, useCreateClient } from './hooks'
import ClientForm from './components/ClientForm'
import type { ClientFormValues, ModifiedFields, EMPTY_CLIENT } from './types'
import { EMPTY_CLIENT as emptyClient } from './types'

const ClientAddPage: React.FC = () => {
  const { t } = useTranslation()
  const { logClientCreation, navigateToClientList } = useClientActions()

  const handleSuccess = useCallback(() => {
    navigateToClientList()
  }, [navigateToClientList])

  const createClient = useCreateClient(handleSuccess)

  const handleSubmit = useCallback(
    async (values: ClientFormValues, message: string, modifiedFields: ModifiedFields) => {
      try {
        const result = await createClient.mutateAsync({ data: values })
        if (result) {
          await logClientCreation(result, message, modifiedFields)
        }
      } catch (error) {
        console.error('Error creating client:', error)
      }
    },
    [createClient, logClientCreation],
  )

  SetTitle(t('titles.add_openid_connect_client'))

  return (
    <GluuLoader blocking={createClient.isPending}>
      <ClientForm
        client={emptyClient}
        isEdit={false}
        viewOnly={false}
        onSubmit={handleSubmit}
        onCancel={navigateToClientList}
      />
    </GluuLoader>
  )
}

export default ClientAddPage
