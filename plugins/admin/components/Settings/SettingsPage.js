import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux'
import { Formik } from 'formik'

import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from '../../../../app/routes/Apps/Gluu/GluuSelectRow';

import { Form, Container, Card, CardBody, FormGroup, Col, Label, Badge, InputGroup, CustomInput } from '../../../../app/components'
import GluuDarkModeToggle from '../../../../app/routes/Apps/Gluu/GluuDarkModeToggle';

function SettingsPage({  }) {
  const { t } = useTranslation();
  const [paggingSize, setPaggingSize] = useState(localStorage.getItem('paggingSize') || 10)
  
  const levels = [1, 5, 10, 20]
  return (
    <React.Fragment>
        {/* <Container> */}
          <Card>
            <CardBody>
              <FormGroup row>
                <GluuLabel label="List paging size" size={4} />
                <Col sm={8}>
                  <InputGroup>
                    <CustomInput
                      type="select"
                      id="pagingSize"
                      name="pagingSize"
                      defaultValue={levels[levels.findIndex((element) => { return element == paggingSize })]}
                      onChange={(value) => {
                        let size = levels[value.target.options.selectedIndex]
                        setPaggingSize(size)
                        localStorage.setItem('paggingSize', size)
                      }}
                    >
                      {/* <option value="">{t('actions.choose')}...</option> */}
                      {levels.map((item, key) => (
                        <option value={item} key={key}>
                          {item}
                        </option>
                      ))}
                    </CustomInput>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row style={{justifyContent:"space-between"}}>
                <GluuLabel label="Dark Mode" />
                <div className="toggle-container" style={{display:"flex", flexDirection:"column", justifyContent:"center", padding:"0px 15px 0px 15px"}}>
                  <GluuDarkModeToggle />
                </div>
              </FormGroup>
              <FormGroup row style={{justifyContent:"space-between"}}>
                <GluuLabel label="Config API URL" />
                <Label style={{display:"flex", flexDirection:"column", justifyContent:"center", paddingLeft:"15px", paddingRight:"15px"}} >
                  <h3><Badge color={'primary'} >{process.env.CONFIG_API_BASE_URL}</Badge></h3>
                </Label>
              </FormGroup>
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
