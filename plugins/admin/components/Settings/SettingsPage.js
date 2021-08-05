import React, { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux'
import { Formik } from 'formik'

import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow';

import { Form, Container, Card, CardBody, FormGroup, Col, Label, Badge } from '../../../../app/components'
import GluuDarkModeToggle from '../../../../app/routes/Apps/Gluu/GluuDarkModeToggle';

function SettingsPage({  }) {
  const { t } = useTranslation();
  useEffect(() => {
    
  }, [])
  const initialValues = {

  }
  const levels = ['1', '5', '10', '20']
  return (
    <React.Fragment>
        {/* <Container> */}
          <Card>
            <CardBody>
            <Formik
                initialValues={initialValues}
                onSubmit={(value) => {
                  console.log("value", value)
                }}
              >
                {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                    <GluuSelectRow
                      label="List paging size"
                      name="pagingSize"
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      value={levels[0]}
                      values={levels}
                    ></GluuSelectRow>
                    <FormGroup row style={{justifyContent:"space-between"}}>
                      <GluuLabel label="Dark Mode" />
                      <div className="toggle-container" style={{display:"flex", flexDirection:"column", justifyContent:"center", padding:"0px 15px 0px 15px"}}>
                        <GluuDarkModeToggle />
                      </div>
                    </FormGroup>
                    <FormGroup row style={{justifyContent:"space-between"}}>
                      <GluuLabel label="Config API URL" />
                      <Label sm={ 3 } style={{display:"flex", flexDirection:"column", justifyContent:"center"}} >
                        <Badge color={'primary'} style={{fontSize:"100%"}}>admin.org</Badge>
                      </Label>
                    </FormGroup>
                  </Form>)}
              </Formik>
            </CardBody>
          </Card>
        {/* </Container> */}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(mapStateToProps)(SettingsPage)
