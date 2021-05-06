import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, CardBody, Card } from '../../../../app/components'
import LdapForm from './LdapForm'
import { editLdap } from '../../redux/actions/LdapActions'
function LdapEditPage({ item, dispatch }) {
  const history = useHistory()
  function handleSubmit(data) {
    if (data) {
      dispatch(editLdap(data))
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
