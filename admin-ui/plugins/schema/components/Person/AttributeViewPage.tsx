import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'
import { JansAttribute, useGetAttributesByInum } from 'JansConfigApi'
import { AttributeItem } from '../types/AttributeListPage.types'
import { useTranslation } from 'react-i18next'
import { getErrorMessage } from '../../utils/errorHandler'
import { getDefaultAttributeItem } from '../../utils/formHelpers'

function AttributeViewPage(): JSX.Element {
  const { gid } = useParams<{ gid: string }>()
  const { t } = useTranslation()

  const inum = gid?.replace(/^:/, '') || ''

  const {
    data: attribute,
    isLoading,
    error: queryError,
  } = useGetAttributesByInum(inum, {
    query: {
      enabled: !!inum,
    },
  })

  const defaultAttribute = useMemo(() => getDefaultAttributeItem(), [])

  const extensibleItems = useMemo(() => {
    if (!attribute) return defaultAttribute
    const cloned = cloneDeep(attribute) as JansAttribute

    if (!cloned.attributeValidation) {
      cloned.attributeValidation = {
        maxLength: undefined,
        regexp: undefined,
        minLength: undefined,
      }
    }

    return cloned
  }, [attribute, defaultAttribute])

  function customHandleSubmit(): void {}

  if (queryError) {
    return (
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>{getErrorMessage(queryError, 'errors.attribute_load_failed', t)}</CardBody>
      </Card>
    )
  }

  return (
    <GluuLoader blocking={isLoading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm
            item={extensibleItems as AttributeItem}
            customOnSubmit={customHandleSubmit}
            hideButtons={{ save: true, back: true }}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeViewPage
