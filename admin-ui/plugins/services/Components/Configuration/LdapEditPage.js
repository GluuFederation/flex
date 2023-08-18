import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { editLdap } from 'Plugins/services/redux/features/ldapSlice'
import { buildPayload } from 'Utils/PermChecker'
import { isEmpty } from 'lodash'
import { toggleSavedFormFlag } from 'Plugins/services/redux/features/ldapSlice'

function LdapEditPage({ item }) {
  const dispatch = useDispatch()
  const userAction = {}
  const navigate =useNavigate()
  const { savedForm } = useSelector((state) => state.ldapReducer)

  useEffect(() => {
    if (savedForm) {
      navigate('/config/ldap')
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
    }
  }, [savedForm])

  function handleSubmit(data) {
    if (!isEmpty(data)) {
      const message = data.action_message
      delete data.action_message
      buildPayload(userAction, message, data)
      dispatch(editLdap({ data: userAction }))
    }
  }

  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <LdapForm item={{ ...item }} handleSubmit={handleSubmit} />
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
