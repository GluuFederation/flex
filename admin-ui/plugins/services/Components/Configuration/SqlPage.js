import React, { useEffect } from 'react'
import BlockUi from '../../../../app/components/BlockUi/BlockUi'
import { Formik } from 'formik'
import { Form, Container, Card, CardBody } from 'Components'
import GluuFooter from 'Routes/Apps/Gluu/GluuFooter'
import LdapItem from './LdapItem'
import { useDispatch, useSelector } from 'react-redux'
import { getLdapConfig, editLdap } from 'Plugins/services/redux/features/ldapSlice'
import { useTranslation } from 'react-i18next'

function SqlPage() {
  const { t } = useTranslation()
  const ldap = useSelector((state) => state.ldapReducer.ldap)
  const loading = useSelector((state) => state.ldapReducer.loading)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getLdapConfig())
  }, [])

  return (
    <React.Fragment>
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={t('messages.request_waiting_message')}
        >
          <Card>
            <CardBody>
              <Formik
                initialValues={ldap}
                onSubmit={(values) => {
                  dispatch(editLdap({ data: JSON.stringify(values) }))
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    {ldap.map((dap, index) => (
                      <LdapItem key={index} ldap={dap} formik={formik} index={index}></LdapItem>
                    ))}
                    <GluuFooter />
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}

export default SqlPage
