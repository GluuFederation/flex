import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from './AttributeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { editAttribute } from 'Plugins/schema/redux/actions/AttributeActions'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

function AttributeEditPage({ item, loading, dispatch }) {
  if (!item.attributeValidation) {
    item.attributeValidation = {
      maxLength: null,
      regexp: null,
      minLength: null,
    }
  }
  const history = useHistory()
  function customHandleSubmit(data) {
    if (data) {
      dispatch(editAttribute(data))
      history.push('/attributes')
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <AttributeForm item={item} customOnSubmit={customHandleSubmit} />
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
