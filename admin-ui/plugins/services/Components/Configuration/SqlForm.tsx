import React, { useState, ReactElement } from 'react'
import { useFormik, FormikContextType } from 'formik'
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
import type { SqlConfiguration } from './sqlApiMocks'
import type { SqlFormProps } from './types'
import { sqlConfigurationSchema } from './utils/validations'

function SqlForm({ item, handleSubmit, isLoading = false }: SqlFormProps): ReactElement {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)

  function activateValidation(): void {
    if (!init) {
      setInit(true)
    }
  }

  function toggle(): void {
    setModal(!modal)
  }

  const formik = useFormik<SqlConfiguration>({
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
    validationSchema: sqlConfigurationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const result: SqlConfiguration = { ...item, ...values }
      const reqBody = { sql: result }
      handleSubmit(reqBody)
    },
  })

  function handleFormSubmit(): void {
    toggle()
    formik.submitForm()
  }

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
                  invalid={!!formik.errors.configId && formik.touched.configId}
                  placeholder={t('placeholders.sql_config_name')}
                  id="configId"
                  name="configId"
                  defaultValue={item.configId}
                  disabled
                  onKeyUp={activateValidation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              ) : (
                <Input
                  valid={!formik.errors.configId && !formik.touched.configId && init}
                  invalid={!!formik.errors.configId && formik.touched.configId}
                  placeholder={t('placeholders.sql_config_name')}
                  id="configId"
                  name="configId"
                  defaultValue={item.configId}
                  onKeyUp={activateValidation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                invalid={!!formik.errors.userName && formik.touched.userName}
                name="userName"
                defaultValue={item.userName}
                onKeyUp={activateValidation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                  invalid={!!formik.errors.userPassword && formik.touched.userPassword}
                  onKeyUp={activateValidation}
                  id="userPassword"
                  type="password"
                  defaultValue={item.userPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                invalid={!!formik.errors.schemaName && formik.touched.schemaName}
                name="schemaName"
                defaultValue={item.schemaName}
                onKeyUp={activateValidation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                onKeyUp={activateValidation}
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
                onKeyUp={activateValidation}
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
                  onKeyUp={activateValidation}
                  defaultChecked={item.enabled}
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <FormGroup row></FormGroup>
        <GluuCommitFooter saveHandler={toggle} />
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={handleFormSubmit}
          formik={formik}
        />
      </GluuLoader>
    </Form>
  )
}

export default SqlForm
