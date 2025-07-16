import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { addAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

interface SubmitData {
  data: string
  userMessage: string
}

interface AttributeItem {
  inum?: string
  name: string
  displayName: string
  description: string
  status: string
  dataType: string
  editType: string[]
  viewType: string[]
  usageType: string[]
  jansHideOnDiscovery: boolean
  oxMultiValuedAttribute: boolean
  attributeValidation: {
    regexp?: string | null
    minLength?: number | null
    maxLength?: number | null
  }
  scimCustomAttr: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
}

function AttributeAddPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function onSubmit({ data, userMessage }: SubmitData) {
    if (data) {
      dispatch(addAttribute({ action: { action_data: data, action_message: userMessage } } as any))
      navigate('/attributes')
    }
  }

  const defautAttribute: AttributeItem = {
    name: '',
    displayName: '',
    description: '',
    status: 'ACTIVE',
    dataType: 'STRING',
    editType: ['ADMIN'],
    viewType: ['ADMIN'],
    usageType: ['OPENID'],
    jansHideOnDiscovery: false,
    oxMultiValuedAttribute: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
    scimCustomAttr: false,
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
