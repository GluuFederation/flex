import React, { useEffect, useState } from 'react';
import BlockUi from 'react-block-ui';
import { Formik } from 'formik';
import {
  Form,
  Container,
  Card,
  CardBody,

} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import LdapItem from './LdapItem'
import { connect } from 'react-redux'
import { getLdapConfig, editLdap } from '../../../redux/actions/LdapActions'

function LdapPage({ ldap, loading, dispatch }) {

  const [initialValues, setInitialValues] = useState({})

  useEffect(() => {
    dispatch(getLdapConfig())
  }, [])

  useEffect(() => {
    if (ldap.length) {
      setInitialValues({
        configId: ldap[0].configId,
        bindDN: ldap[0].bindDN,
        bindPassword: ldap[0].bindPassword,
        servers: ldap[0].servers,
        maxConnections: ldap[0].maxConnections,
        useSSL: ldap[0].useSSL,
        baseDNs: ldap[0].baseDNs,
        primaryKey: ldap[0].primaryKey,
        localPrimaryKey: ldap[0].localPrimaryKey,
        useAnonymousBind: ldap[0].useAnonymousBind,
        enabled: ldap[0].enabled,
        version: ldap[0].version,
        level: ldap[0].level,
      })
    }
  }, [ldap])

  return (
    <React.Fragment>
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={'Performing the request, please wait!'}
        >
          {
            Object.keys(initialValues).length && ldap.length ?
              <Card>
                <CardBody>
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                      dispatch(editLdap(JSON.stringify(values)))
                    }}
                  >
                    {(formik) => (
                      <Form onSubmit={formik.handleSubmit}>
                        { ldap.map((dap, index) => (
                          <LdapItem key={index} ldap={dap} formik={formik} index={index}></LdapItem>
                        ))}
                        <GluuFooter />
                      </Form>
                    )}
                  </Formik>

                </CardBody>
              </Card> : null
          }
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    ldap: state.ldapReducer.ldap,
    permissions: state.authReducer.permissions,
    loading: state.ldapReducer.loading,
  }
}

export default connect(mapStateToProps)(LdapPage)
