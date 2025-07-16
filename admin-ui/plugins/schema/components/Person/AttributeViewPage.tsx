import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { editAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { cloneDeep } from 'lodash'

// Define interfaces for TypeScript
interface AttributeValidation {
  maxLength?: number | null
  regexp?: string | null
  minLength?: number | null
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

interface AttributeState {
  item: AttributeItem
  loading: boolean
  items: AttributeItem[]
  totalItems: number
  entriesCount: number
}

interface RootState {
  attributeReducer: AttributeState
}

interface SubmitData {
  data: string
  userMessage: string
}

function AttributeViewPage() {
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

  function customHandleSubmit(data: SubmitData) {
    if (data) {
      dispatch(editAttribute({ data } as any))
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
            hideButtons={true}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default AttributeViewPage
