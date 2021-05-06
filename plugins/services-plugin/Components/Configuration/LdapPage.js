import React, { useEffect } from 'react';
import BlockUi from 'react-block-ui';
import { Formik } from 'formik';
import {
  Form,
  Container,
  Card,
  CardBody,

} from '../../../../app/components';
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter';
import LdapItem from './LdapItem';
import { connect } from 'react-redux';
import { getLdapConfig, editLdap } from '../../redux/actions/LdapActions';

function LdapPage({ ldap, loading, dispatch }) {

  useEffect(() => {
    dispatch(getLdapConfig());
  }, []);

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
                    initialValues={ldap}
                    onSubmit={(values) => {
                      dispatch(editLdap(JSON.stringify(values)));
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
            </Card>
        </BlockUi>
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    ldap: state.ldapReducer.ldap,
    permissions: state.authReducer.permissions,
    loading: state.ldapReducer.loading,
  };
};

export default connect(mapStateToProps)(LdapPage);
