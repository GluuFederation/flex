import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { addAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { AttributeItem, SubmitData } from '../types/AttributeListPage.types'
import { JansAttribute } from 'Plugins/schema/types'

function AttributeAddPage(): JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function onSubmit({ data, userMessage }: SubmitData): void {
    if (data) {
      dispatch(
        addAttribute({
          action: { action_data: data as JansAttribute, action_message: userMessage },
        }),
      )
      navigate('/attributes')
    }
  }

  const defaultAttribute: Partial<AttributeItem> = {
    jansHideOnDiscovery: false,
    selected: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    required: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
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
