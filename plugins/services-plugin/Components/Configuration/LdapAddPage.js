import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import LdapForm from './LdapForm'
import { addLdap } from '../../redux/actions/LdapActions'
import { buildPayload } from '../../../../app/utils/PermChecker'

function LdapAddPage({ dispatch }) {
  const userAction = {}
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      let message = "LDAP Auth" //data.customScript.action_message
      //delete data.customScript.action_message
      console.log('LDAP data:')
      console.log(data)
      buildPayload(userAction, message, data)
      dispatch(addLdap(userAction))
      history.push('/config/ldap')
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
            <LdapForm item={defautConfigurations} handleSubmit={handleSubmit} />
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
