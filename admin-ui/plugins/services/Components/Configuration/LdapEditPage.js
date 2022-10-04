import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { editLdap } from 'Plugins/services/redux/actions/LdapActions'
import { buildPayload } from 'Utils/PermChecker'

function LdapEditPage({ item, dispatch }) {
  const userAction = {}
  const navigate =useNavigate()
  function handleSubmit(data) {
    if (data) {
      const message = data.ldap.action_message
      delete data.ldap.action_message
      buildPayload(userAction, message, data)
      dispatch(editLdap(userAction))
      navigate('/config/ldap')
    }
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <LdapForm item={item} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    item: state.ldapReducer.item,
    loading: state.ldapReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(LdapEditPage)
