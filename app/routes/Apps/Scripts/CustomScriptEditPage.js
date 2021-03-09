import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from './../../../components'
import CustomScriptForm from './CustomScriptForm'
import BlockUi from 'react-block-ui'
import { editCustomScript } from '../../../redux/actions/CustomScriptActions'

function CustomScriptEditPage({ item, loading, dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(editCustomScript(data))
      history.push('/scripts')
    }
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <BlockUi
              tag="div"
              blocking={loading}
              keepInView={true}
              message={'Performing the request, please wait!'}
            >
              <CustomScriptForm item={item} handleSubmit={handleSubmit} />
            </BlockUi>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    item: state.customScriptReducer.item,
    loading: state.customScriptReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(CustomScriptEditPage)
