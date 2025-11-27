import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'
import type {
  AttributeItem,
  SubmitData,
} from 'Plugins/schema/components/types/AttributeListPage.types'
import {
  JansAttribute,
  useGetAttributesByInum,
  usePutAttributes,
  getGetAttributesQueryKey,
  getGetAttributesByInumQueryKey,
} from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { UPDATE } from '@/audit/UserActionType'
import { useSchemaAuditLogger } from '../../hooks/useSchemaAuditLogger'
import { useSchemaWebhook } from '../../hooks/useSchemaWebhook'
import { API_ATTRIBUTE } from '../../constants'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../utils/errorHandler'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

function AttributeEditPage(): JSX.Element {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { gid } = useParams<{ gid: string }>()
  const { t } = useTranslation()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()
  const { navigateBack } = useAppNavigation()

  const inum = gid?.replace(':', '') || ''

  const {
    data: attribute,
    isLoading,
    error: queryError,
  } = useGetAttributesByInum(inum, {
    query: {
      enabled: !!inum,
    },
  })

  const putAttributeMutation = usePutAttributes({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })
        queryClient.invalidateQueries({ queryKey: getGetAttributesByInumQueryKey(inum) })
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error, 'errors.attribute_update_failed', t)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const extensibleItems = useMemo(() => {
    if (!attribute) return null
    const cloned = cloneDeep(attribute) as JansAttribute

    if (!cloned.attributeValidation) {
      cloned.attributeValidation = {
        maxLength: undefined,
        regexp: undefined,
        minLength: undefined,
      }
    }

    return cloned
  }, [attribute])

  const customHandleSubmit = useCallback(
    ({ data, userMessage, modifiedFields, performedOn }: SubmitData): void => {
      if (data) {
        putAttributeMutation.mutate(
          { data: data as JansAttribute },
          {
            onSuccess: async (updatedAttribute: JansAttribute) => {
              await logAudit({
                action: UPDATE,
                resource: API_ATTRIBUTE,
                message: userMessage || '',
                modifiedFields,
              })

              triggerAttributeWebhook(updatedAttribute)
              navigateBack(ROUTES.ATTRIBUTES_LIST)
            },
          },
        )
      }
    },
    [putAttributeMutation, logAudit, triggerAttributeWebhook, navigateBack],
  )

  if (queryError) {
    return (
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          {t('errors.attribute_load_failed')}:{' '}
          {getErrorMessage(queryError, 'errors.attribute_load_failed', t)}
        </CardBody>
      </Card>
    )
  }

  if (!extensibleItems) {
    return (
      <GluuLoader blocking={isLoading}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>{t('messages.loading_attribute')}</CardBody>
        </Card>
      </GluuLoader>
    )
  }

  return (
    <GluuLoader blocking={isLoading || putAttributeMutation.isPending}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm
            item={extensibleItems as AttributeItem}
            customOnSubmit={customHandleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeEditPage
