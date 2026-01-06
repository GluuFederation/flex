import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  usePostConfigDatabaseSql,
  getGetConfigDatabaseSqlQueryKey,
  type SqlConfiguration,
} from 'JansConfigApi'
import { useSqlAudit } from './hooks'

function SqlAddPage(): ReactElement {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const queryClient = useQueryClient()
  const { logSqlCreate } = useSqlAudit()

  const addMutation = usePostConfigDatabaseSql({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
        try {
          await logSqlCreate(variables.data, 'SQL configuration created')
        } catch (error) {
          console.error('Failed to log SQL create:', error)
        }
        navigateBack(ROUTES.SQL_LIST)
      },
      onError: () => {
        dispatch(updateToast(true, 'danger'))
      },
    },
  })

  function handleSubmit(data: { sql: SqlConfiguration }): void {
    if (data) {
      const { action_message, ...cleanData } = data.sql as SqlConfiguration & { action_message?: string }
      addMutation.mutate({ data: cleanData })
    }
  }

  const defaultConfigurations: SqlConfiguration = {}

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm
              item={defaultConfigurations}
              handleSubmit={handleSubmit}
              isLoading={addMutation.isPending}
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default SqlAddPage
