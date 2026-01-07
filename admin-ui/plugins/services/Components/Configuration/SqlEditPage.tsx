import React, { ReactElement, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { cloneDeep } from 'lodash'
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
import { extractActionMessage } from './types'

function SqlEditPage(): ReactElement | null {
  const item = useAtomValue(currentSqlItemAtom)
  const dispatch = useDispatch()
  const { navigateBack, navigateToRoute } = useAppNavigation()
  const queryClient = useQueryClient()
  const { logSqlUpdate } = useSqlAudit()
  const actionMessageRef = useRef<string>('SQL configuration updated')

  const editMutation = usePutConfigDatabaseSql({
    mutation: {
      onSuccess: async (data, variables) => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetConfigDatabaseSqlQueryKey() })
        try {
          await logSqlUpdate(variables.data, actionMessageRef.current)
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
      const { cleanData, message } = extractActionMessage(
        data.sql as SqlConfiguration & { action_message?: string },
        'SQL configuration updated',
      )
      actionMessageRef.current = message
      editMutation.mutate({ data: cleanData })
    }
  }

  useEffect(() => {
    if (!item) {
      navigateToRoute(ROUTES.SQL_LIST)
    }
  }, [item, navigateToRoute])

  if (!item) {
    return null
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <SqlForm
              item={cloneDeep(item)}
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
