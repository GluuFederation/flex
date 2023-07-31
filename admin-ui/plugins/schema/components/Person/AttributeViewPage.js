import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { editAttribute } from 'Plugins/schema/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function AttributeEditPage({ item: { ...extensibleItems }, loading, dispatch }) {
  if (!extensibleItems.attributeValidation) {
    extensibleItems.attributeValidation = {
      maxLength: null,
      regexp: null,
      minLength: null,
    }
  }
  const navigate =useNavigate()
  function customHandleSubmit(data) {
    if (data) {
      dispatch(editAttribute({ data }))
      navigate('/attributes')
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm
            item={{ ...extensibleItems, attributeValidation: { ...extensibleItems.attributeValidation } }}
            customOnSubmit={customHandleSubmit}
            hideButtons={{ save: true }}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}
const mapStateToProps = (state) => {
  return {
    item: state.attributeReducer.item,
    loading: state.attributeReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(AttributeEditPage)
