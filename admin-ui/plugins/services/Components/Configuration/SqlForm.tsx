import React, { useState, ReactElement } from 'react'
import { useFormik, FormikContextType } from 'formik'
import * as Yup from 'yup'
import { Col, InputGroup, Form, FormGroup, Input } from 'Components'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { SQL } from 'Utils/ApiResources'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import type { SqlConfiguration } from 'JansConfigApi'

interface SqlFormProps {
  item: SqlConfiguration
  handleSubmit: (data: { sql: SqlConfiguration }) => void
  isLoading?: boolean
}

function SqlForm({ item, handleSubmit, isLoading = false }: SqlFormProps): ReactElement {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)

  function toogle(): void {
    if (!init) {
      setInit(true)
    }
  }

  function toggle(): void {
    setModal(!modal)
  }

  function submitForm(): void {
    toggle()
    const submitButton = document.getElementsByClassName('UserActionSubmitButton')[0] as HTMLElement
    if (submitButton) {
      submitButton.click()
    }
  }

  const formik = useFormik({
    initialValues: {
      configId: item.configId || '',
      userName: item.userName || '',
      userPassword: item.userPassword || '',
      connectionUri: item.connectionUri || [],
      schemaName: item.schemaName || '',
      passwordEncryptionMethod: item.passwordEncryptionMethod || '',
      serverTimezone: item.serverTimezone || '',
      binaryAttributes: item.binaryAttributes || [],
      certificateAttributes: item.certificateAttributes || [],
      enabled: item.enabled || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      configId: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      userName: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      userPassword: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      connectionUri: Yup.array().required('Required!'),
      schemaName: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
    }),
    onSubmit: (values) => {
      const result: SqlConfiguration = { ...item, ...values }
      const reqBody = { sql: result }
      handleSubmit(reqBody)
    },
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      <GluuLoader blocking={isLoading}>
        <GluuTooltip doc_category={SQL} doc_entry="config_name">
          <FormGroup row>
            <GluuLabel label="fields.name" required />
            <Col sm={9}>
              {item.configId ? (
                <Input
                  valid={!formik.errors.configId && !formik.touched.configId && init}
                  placeholder={t('placeholders.sql_config_name')}
                  id="configId"
                  name="configId"
                  defaultValue={item.configId}
                  disabled
                  onKeyUp={toogle}
                  onChange={formik.handleChange}
                />
              ) : (
                <Input
                  valid={!formik.errors.configId && !formik.touched.configId && init}
                  placeholder={t('placeholders.sql_config_name')}
                  id="configId"
                  name="configId"
                  defaultValue={item.configId}
                  onKeyUp={toogle}
                  onChange={formik.handleChange}
                />
              )}
              {formik.errors.configId && formik.touched.configId ? (
                <div style={{ color: customColors.accentRed }}>{formik.errors.configId}</div>
              ) : null}
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={SQL} doc_entry="username">
          <FormGroup row>
            <GluuLabel label="fields.username" required />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.sql_username')}
                id="userName"
                valid={!formik.errors.userName && !formik.touched.userName && init}
                name="userName"
                defaultValue={item.userName}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
              {formik.errors.userName && formik.touched.userName ? (
                <div style={{ color: customColors.accentRed }}>{formik.errors.userName}</div>
              ) : null}
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={SQL} doc_entry="password">
          <FormGroup row>
            <GluuLabel label="fields.password" required />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder={t('placeholders.sql_password')}
                  valid={!formik.errors.userPassword && !formik.touched.userPassword && init}
                  onKeyUp={toogle}
                  id="userPassword"
                  type="password"
                  defaultValue={item.userPassword}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              {formik.errors.userPassword && formik.touched.userPassword ? (
                <div style={{ color: customColors.accentRed }}>{formik.errors.userPassword}</div>
              ) : null}
            </Col>
          </FormGroup>
        </GluuTooltip>
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="connectionUri"
              label="fields.connectionUris"
              formik={formik as FormikContextType<unknown>}
              required={true}
              options={['jdbc:mysql://localhost:3306/gluudb']}
              value={item.connectionUri}
              doc_category={SQL}
              doc_entry="connectionUri"
            />

            {formik.errors.connectionUri && formik.touched.connectionUri ? (
              <div style={{ color: customColors.accentRed }}>
                {String(formik.errors.connectionUri)}
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <GluuTooltip doc_category={SQL} doc_entry="schemaname">
          <FormGroup row>
            <GluuLabel label="fields.schemaName" required />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.sql_schemaname')}
                id="schemaName"
                valid={!formik.errors.schemaName && !formik.touched.schemaName && init}
                name="schemaName"
                defaultValue={item.schemaName}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
              {formik.errors.schemaName && formik.touched.schemaName ? (
                <div style={{ color: customColors.accentRed }}>{formik.errors.schemaName}</div>
              ) : null}
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={SQL} doc_entry="passwordEncryptionMethod">
          <FormGroup row>
            <GluuLabel label="fields.passwordEncryptionMethod" />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.sql_passwordEncryptionMethod')}
                id="passwordEncryptionMethod"
                valid={
                  !formik.errors.passwordEncryptionMethod &&
                  !formik.touched.passwordEncryptionMethod &&
                  init
                }
                name="passwordEncryptionMethod"
                defaultValue={item.passwordEncryptionMethod}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={SQL} doc_entry="serverTimezone">
          <FormGroup row>
            <GluuLabel label="fields.serverTimezone" />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.sql_serverTimezone')}
                id="serverTimezone"
                valid={!formik.errors.serverTimezone && !formik.touched.serverTimezone && init}
                name="serverTimezone"
                defaultValue={item.serverTimezone}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
        </GluuTooltip>
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="binaryAttributes"
              label="fields.binaryAttributes"
              formik={formik as FormikContextType<unknown>}
              required={false}
              options={['objectGUID']}
              value={item.binaryAttributes}
              doc_category={SQL}
              doc_entry="binaryAttributes"
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="certificateAttributes"
              label="fields.certificateAttributes"
              formik={formik as FormikContextType<unknown>}
              required={false}
              options={['userCertificate']}
              value={item.certificateAttributes}
              doc_category={SQL}
              doc_entry="certificateAttributes"
            />
          </Col>
        </FormGroup>
        <GluuTooltip doc_category={SQL} doc_entry="activate">
          <FormGroup row>
            <GluuLabel label="fields.activate" />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder={t('placeholders.activate_sql_configuration')}
                  valid={!formik.errors.enabled && !formik.touched.enabled && init}
                  type="checkbox"
                  id="enabled"
                  onKeyUp={toogle}
                  defaultChecked={item.enabled}
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <FormGroup row></FormGroup>
        <GluuCommitFooter saveHandler={toggle} />
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
      </GluuLoader>
    </Form>
  )
}

export default SqlForm
