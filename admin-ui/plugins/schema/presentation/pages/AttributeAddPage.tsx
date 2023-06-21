import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from '../components/Person/AttributeForm'
import { addAttribute } from 'Plugins/schema/domain/redux/features/AttributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { TDefautAttribute } from 'Plugins/schema/domain/entities/TDefautAttribute'

function AttributeAddPage({ dispatch }) {
  const navigate = useNavigate()

  function onSubmit(data) {
    if (data) {
      dispatch(addAttribute({ data }))
      navigate('/attributes')
    }
  }

  const defautAttribute: TDefautAttribute = {
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
const mapStateToProps = (state) => {
  return {
    loading: state.attributeReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(AttributeAddPage)
