import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import AttributeForm from '../components/Person/AttributeForm'
import { addAttribute } from 'Plugins/schema/domain/redux/features/attributeSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { defautAttribute } from 'Plugins/schema/domain/use-cases/attributeUseCases'

function AttributeAddPage({ dispatch }) {
  const navigate = useNavigate()

  function onSubmit(data) {
    if (data) {
      dispatch(addAttribute({ data }))
      navigate('/attributes')
    }
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
