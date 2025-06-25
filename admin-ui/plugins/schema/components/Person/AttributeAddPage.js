import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { addAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function AttributeAddPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function onSubmit({ data, userMessage }) {
    if (data) {
      dispatch(addAttribute({ action: { action_data: data, action_message: userMessage } }))
      navigate('/attributes')
    }
  }

  const defautAttribute = {
    jansHideOnDiscovery: false,
    selected: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    requred: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
  }

  return (
    <React.Fragment>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm item={defautAttribute} customOnSubmit={onSubmit} />
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default AttributeAddPage
