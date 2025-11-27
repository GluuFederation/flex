import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, CardBody, Card } from 'Components'
import LdapForm from './LdapForm'
import { editLdap, toggleSavedFormFlag } from 'Plugins/services/redux/features/ldapSlice'
import { buildPayload } from 'Utils/PermChecker'
import { cloneDeep, isEmpty } from 'lodash'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

function LdapEditPage() {
  const item = useSelector((state) => state.ldapReducer.item)
  const dispatch = useDispatch()
  const userAction = {}
  const { navigateBack } = useAppNavigation()
  const { savedForm } = useSelector((state) => state.ldapReducer)

  useEffect(() => {
    if (savedForm) {
      navigateBack(ROUTES.LDAP_LIST)
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
    }
  }, [savedForm, navigateBack, dispatch])

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
            <LdapForm item={cloneDeep(item)} handleSubmit={handleSubmit} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default LdapEditPage
