import React, { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { AttributeItem, SubmitData } from '../types/AttributeListPage.types'
import { JansAttribute, usePostAttributes, getGetAttributesQueryKey } from 'JansConfigApi'
import { updateToast } from 'Redux/features/toastSlice'
import { useDispatch } from 'react-redux'
import { CREATE } from '@/audit/UserActionType'
import { useSchemaAuditLogger } from '../../hooks/useSchemaAuditLogger'
import { useSchemaWebhook } from '../../hooks/useSchemaWebhook'
import { API_ATTRIBUTE } from '../../constants'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../utils/errorHandler'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

function AttributeAddPage(): JSX.Element {
  const { navigateBack } = useAppNavigation()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { logAudit } = useSchemaAuditLogger()
  const { triggerAttributeWebhook } = useSchemaWebhook()

  const postAttributeMutation = usePostAttributes({
    mutation: {
      onSuccess: () => {
        dispatch(updateToast(true, 'success'))
        queryClient.invalidateQueries({ queryKey: getGetAttributesQueryKey() })
        navigateBack(ROUTES.ATTRIBUTES_LIST)
      },
      onError: (error: Error | Record<string, never>) => {
        const errorMessage = getErrorMessage(error, 'errors.attribute_create_failed', t)
        dispatch(updateToast(true, 'error', errorMessage))
      },
    },
  })

  const onSubmit = useCallback(
    ({ data, userMessage }: SubmitData): void => {
      if (data) {
        postAttributeMutation.mutate(
          { data: data as JansAttribute },
          {
            onSuccess: (createdAttribute: JansAttribute) => {
              logAudit({
                action: CREATE,
                resource: API_ATTRIBUTE,
                message: userMessage || '',
                payload: createdAttribute,
              })

              triggerAttributeWebhook(createdAttribute)
            },
          },
        )
      }
    },
    [postAttributeMutation, logAudit, triggerAttributeWebhook],
  )

  const defaultAttribute: Partial<AttributeItem> = {
    jansHideOnDiscovery: false,
    selected: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    required: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
    editType: [],
    viewType: [],
    usageType: [],
  }

  return (
    <React.Fragment>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm item={defaultAttribute as AttributeItem} customOnSubmit={onSubmit} />
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default AttributeAddPage
