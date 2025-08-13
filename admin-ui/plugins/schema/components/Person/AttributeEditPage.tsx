import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { editAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'
import type { JansAttribute } from 'Plugins/schema/types'
import type {
  AttributeItem,
  RootState,
  SubmitData,
} from 'Plugins/schema/components/types/AttributeListPage.types'

function AttributeEditPage(): JSX.Element {
  const item = useSelector((state: RootState) => state.attributeReducer.item)
  const loading = useSelector((state: RootState) => state.attributeReducer.loading)
  const extensibleItems = cloneDeep(item) as JansAttribute
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!extensibleItems.attributeValidation) {
    extensibleItems.attributeValidation = {
      maxLength: null,
      regexp: null,
      minLength: null,
    }
  }

  function customHandleSubmit({ data, userMessage }: SubmitData): void {
    if (data) {
      dispatch(
        editAttribute({
          action: { action_data: data as JansAttribute, action_message: userMessage },
        }),
      )
      navigate('/attributes')
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm
            item={
              {
                ...extensibleItems,
                attributeValidation: { ...extensibleItems.attributeValidation },
              } as AttributeItem
            }
            customOnSubmit={customHandleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeEditPage
