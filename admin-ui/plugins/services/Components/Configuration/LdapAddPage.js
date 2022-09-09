import React from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { addLdap } from 'Plugins/services/redux/actions/LdapActions'
import { buildPayload } from 'Utils/PermChecker'

function LdapAddPage({ dispatch }) {
  const userAction = {}
  const navigate =useNavigate()
  function handleSubmit(data) {
    if (data) {
      let message = data.ldap.action_message
      delete data.ldap.action_message
      buildPayload(userAction, message, data)
      dispatch(addLdap(userAction))
      navigate('/config/ldap')
    }
  }
  const defautConfigurations = {
    maxConnections: 2,
    useSSL: false,
    useAnonymousBind: false,
    enabled: false
  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <LdapForm 
              item={defautConfigurations} 
              handleSubmit={handleSubmit} 
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.ldapReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(LdapAddPage)
