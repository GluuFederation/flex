import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CardBody, Card } from '../../../../app/components'
import GluuLoader from '../../../../app/routes/Apps/Gluu/GluuLoader'
import AttributeForm from './AttributeForm'
import { editAttribute } from '../../redux/actions/AttributeActions'

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
      <Card className="mb-3">
        <CardBody>
          <AttributeForm
            item={item}
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
