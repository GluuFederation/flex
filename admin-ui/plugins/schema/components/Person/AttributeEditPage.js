import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { editAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'

function AttributeEditPage() {
  const item = useSelector((state) => state.attributeReducer.item),
    loading = useSelector((state) => state.attributeReducer.loading),
    extensibleItems = cloneDeep(item),
    dispatch = useDispatch(),
    navigate = useNavigate()

  if (!extensibleItems.attributeValidation) {
    extensibleItems.attributeValidation = {
      maxLength: null,
      regexp: null,
      minLength: null,
    }
  }
  function customHandleSubmit({ data, userMessage }) {
    if (data) {
      dispatch(editAttribute({ action: { action_data: data, action_message: userMessage } }))
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
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeEditPage
