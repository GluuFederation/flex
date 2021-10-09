import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import DatePicker from 'react-datepicker'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuCommitFooter from '../../../../app/routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import GluuToogle from '../../../../app/routes/Apps/Gluu/GluuToogle'
import { LICENSE } from '../../../../app/utils/ApiResources'
import GluuTooltip from '../../../../app/routes/Apps/Gluu/GluuTooltip'
import { Col, Form, FormGroup, CustomInput, Accordion } from '../../../../app/components'
import { Formik } from 'formik'

function LicenseDetailsForm({ item, handleSubmit }) {
  const { t } = useTranslation();
  const [validityPeriod, setValidityPeriod] = useState(!!item.validityPeriod ? new Date(item.validityPeriod) : new Date())
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    setValidityPeriod(new Date(item.validityPeriod))
  }, [item.validityPeriod]);

  function activate() {
    if (!init) {
      setInit(true)
    }
  }
  function toggle() {
    setModal(!modal)
  }

  function submitForm() {
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  const initialValues = {
    maxActivations: item.maxActivations,
    licenseActive: item.licenseActive,
    validityPeriod: item.validityPeriod,
  }
  return (
    <>
      {/* <Container> */}
      <Accordion className="mb-2 b-primary" initialOpen>
        <Accordion.Header className="text-primary">
          {t('fields.licenseDetails').toUpperCase()}
        </Accordion.Header>
        <Accordion.Body>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              values.validityPeriod = validityPeriod
              handleSubmit(values)
            }}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <GluuTooltip doc_category={LICENSE} doc_entry="validityPeriod">
                  <FormGroup row>
                    <GluuLabel label="fields.validityPeriod" size={5} />
                    <Col sm={7}>
                      <DatePicker
                        id="validityPeriod"
                        name="validityPeriod"
                        dateFormat="yyyy-MM-dd"
                        selected={validityPeriod}
                        dropdownMode="select"
                        onChange={(date) => setValidityPeriod(date)}
                      />
                    </Col>
                  </FormGroup>
                </GluuTooltip>
                <GluuTooltip doc_category={LICENSE} doc_entry="maxActivations">
                <FormGroup row>
                  <GluuLabel label="fields.maxActivations" size={5} />
                  <Col sm={7}>
                    <CustomInput
                      type="number"
                      placeholder={t('fields.maxActivations')}
                      id="maxActivations"
                      name="maxActivations"
                      defaultValue={item.maxActivations}
                      onChange={formik.handleChange}
                    />
                  </Col>
                </FormGroup>
                </GluuTooltip>
                <GluuTooltip doc_category={LICENSE} doc_entry="isLicenseActive">
                <FormGroup row>
                  <GluuLabel label="fields.isLicenseActive" size={5} />
                  <Col sm={7}>
                    <GluuToogle
                      id="licenseActive"
                      name="licenseActive"
                      formik={formik}
                      value={item.licenseActive}
                    />
                  </Col>
                </FormGroup>
                </GluuTooltip>
                <FormGroup row></FormGroup>
                <GluuCommitFooter saveHandler={toggle} />
                <GluuCommitDialog
                  handler={toggle}
                  modal={modal}
                  onAccept={submitForm}
                  formik={formik}
                />
              </Form>)}
          </Formik>
        </Accordion.Body>
      </Accordion>
    </>
  )
}

export default LicenseDetailsForm
