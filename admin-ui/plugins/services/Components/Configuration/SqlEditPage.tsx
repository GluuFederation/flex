import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import SqlForm from './SqlForm'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAtomValue } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from 'Redux/features/toastSlice'
import {
  usePutConfigDatabaseSql,
  getGetConfigDatabaseSqlQueryKey,
  type SqlConfiguration,
} from 'JansConfigApi'
import { currentSqlItemAtom } from './atoms'
import { useSqlAudit } from './hooks'

function SqlEditPage(): ReactElement {
  const item = useAtomValue(currentSqlItemAtom)
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const queryClient = useQueryClient()
  const { logSqlUpdate } = useSqlAudit()

  const editMutation = usePutConfigDatabaseSql({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
        try {
          await logSqlUpdate(variables.data, 'SQL configuration updated')
        } catch (error) {
          console.error('Failed to log SQL update:', error)
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
      editMutation.mutate({ data: cleanData })
    }
  }

  if (!item) {
    return (
      <Container>
        <Card className="mb-3">
          <CardBody>
            <div>No SQL configuration selected. Please go back and select one.</div>
          </CardBody>
        </Card>
      </Container>
    )
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm
              item={{ ...item }}
              handleSubmit={handleSubmit}
              isLoading={editMutation.isPending}
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default SqlEditPage
