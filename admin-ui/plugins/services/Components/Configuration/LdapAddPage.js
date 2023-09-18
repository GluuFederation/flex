import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { addLdap, toggleSavedFormFlag } from 'Plugins/services/redux/features/ldapSlice'
import { buildPayload } from 'Utils/PermChecker'

function LdapAddPage() {
  const dispatch = useDispatch()
  const userAction = {}
  const navigate = useNavigate()
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
    if (data) {
      let message = data.ldap.action_message
      delete data.ldap.action_message
      buildPayload(userAction, message, data)
      dispatch(addLdap({ data: userAction }))
    }
  }

  const defautConfigurations = {
    maxConnections: 2,
    useSSL: false,
    useAnonymousBind: false,
    enabled: false,
  }
  return (
    <React.Fragment>
      <Container>
        <Card className='mb-3'>
          <CardBody>
            <LdapForm
              item={defautConfigurations}
              handleSubmit={handleSubmit}
              createLdap={true}
            />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default LdapAddPage
