import React, { useEffect } from 'react';
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
  useEffect(() => {
    // dispatch(editLdap(JSON.stringify({
    //   configId: 'auth_ldap_server',
    //   bindDN: 'cn=directory',
    //   bindPassword: 'v7JHsULopbXBz9SEtgx1iQ==',
    //   servers: ['localhost:1636'],
    //   maxConnections: 1000,
    //   useSSL: true,
    //   baseDNs: ['ou=people,o=jans'],
    //   primaryKey: 'uid',
    //   localPrimaryKey: 'uid',
    //   useAnonymousBind: false,
    //   enabled: false,
    //   version: 0,
    //   level: 0,
    // },)))
    dispatch(getLdapConfig())
    console.log("**Ldap: "+ JSON.stringify(ldap))
  }, [])

  const initialValues = {

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
    
  }

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
                    {ldap.length ? ldap.map((ldap, index) => (
                      <LdapItem key={index} ldap={ldap} formik={formik} index={index}></LdapItem>
                    )) : null}
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

const mapStateToProps = (state) => {
  return {
    ldap: state.ldapReducer.ldap,
    permissions: state.authReducer.permissions,
    loading: state.ldapReducer.loading,
  }
}

export default connect(mapStateToProps)(LdapPage)
