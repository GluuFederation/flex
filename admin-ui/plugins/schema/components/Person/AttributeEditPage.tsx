import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { editAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'

interface AttributeValidation {
  regexp?: string | null
  minLength?: number | null
  maxLength?: number | null
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
  attributeValidation: AttributeValidation
  scimCustomAttr: boolean
  claimName?: string
  saml1Uri?: string
  saml2Uri?: string
}

interface AttributeReducerState {
  items: AttributeItem[]
  item: AttributeItem
  loading: boolean
  totalItems: number
  entriesCount: number
}

interface RootState {
  attributeReducer: AttributeReducerState
}

interface SubmitParams {
  data: string
  userMessage: string
}

function AttributeEditPage() {
  const item = useSelector((state: RootState) => state.attributeReducer.item),
    loading = useSelector((state: RootState) => state.attributeReducer.loading),
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
  function customHandleSubmit({ data, userMessage }: SubmitParams) {
    if (data) {
      dispatch(editAttribute({ action: { action_data: data, action_message: userMessage } } as any))
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
