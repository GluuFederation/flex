import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { editAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'
import { JansAttribute } from 'Plugins/schema/types'
import { AttributeItem, RootState } from '../types/AttributeListPage.types'

function AttributeEditPage(): JSX.Element {
  const item = useSelector((state: RootState) => state.attributeReducer.item),
    loading = useSelector((state: RootState) => state.attributeReducer.loading),
    extensibleItems = cloneDeep(item) as AttributeItem,
    dispatch = useDispatch(),
    navigate = useNavigate()

  if (!extensibleItems.attributeValidation) {
    extensibleItems.attributeValidation = {
      maxLength: null,
      regexp: null,
      minLength: null,
    }
  }

  function customHandleSubmit(data: any): void {
    if (data) {
      dispatch(editAttribute({ action: { action_data: data as JansAttribute } }))
      navigate('/attributes')
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm
            item={{
              ...extensibleItems,
              attributeValidation: { ...extensibleItems.attributeValidation },
            }}
            customOnSubmit={customHandleSubmit}
            hideButtons={{ save: true }}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeEditPage
