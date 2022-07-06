import React, { useEffect } from 'react'
import {
  Form,
  Button,
  FormGroup,
  Col,
  CustomInput,
} from 'Components'
import { Formik } from 'formik'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { connect } from 'react-redux'
import { getAcrsConfig, editAcrs } from 'Plugins/auth-server/redux/actions/AcrsActions'
import { JSON_CONFIG } from 'Utils/ApiResources'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  hasPermission,
  buildPayload,
  ACR_READ,
  ACR_WRITE,
} from 'Utils/PermChecker'
import {
  getScripts,
} from 'Redux/actions/InitActions'
import { SIMPLE_PASSWORD_AUTH, FETCHING_SCRIPTS } from 'Plugins/auth-server/common/Constants'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'

function AcrsPage({ acrs, scripts, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const userAction = {}
  const options = {}
  const authScripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => item.name)
  authScripts.push(SIMPLE_PASSWORD_AUTH)
  SetTitle(t('titles.public_keys'))

  useEffect(() => {
    buildPayload(userAction, FETCHING_SCRIPTS, options)
    dispatch(getAcrsConfig())
    dispatch(getScripts(userAction))
  }, [])

  const initialValues = {
    defaultAcr: acrs.defaultAcr,
  }

  return (
    <GluuLoader blocking={loading}>
      <GluuViewWrapper canShow={hasPermission(permissions, ACR_READ)}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            const opts = {}
            opts['authenticationMethod'] = JSON.stringify(values)
            dispatch(editAcrs(opts))
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup row></FormGroup>
              <GluuTooltip doc_category={JSON_CONFIG} doc_entry="defaultAcr">
                <FormGroup row>
                  <GluuLabel label="fields.default_acr" size={4} />
                  <Col sm={8}>
                    <CustomInput
                      type="select"
                      id="defaultAcr"
                      name="defaultAcr"
                      data-testid="defaultAcr"
                      value={acrs.defaultAcr}
                      onChange={(e) => {
                        acrs.defaultAcr = e.target.value
                        formik.setFieldValue('defaultAcr', e.target.value)
                      }}
                    >
                      <option value="">{t('actions.choose')}...</option>
                      {authScripts.map((item, key) => (
                        <option value={item} key={key}>
                          {item}
                        </option>
                      ))}
                    </CustomInput>
                  </Col>
                </FormGroup>
              </GluuTooltip>

              {hasPermission(permissions, ACR_WRITE) && (
                <Button
                  color="primary"
                  type="submit"
                  style={applicationStyle.buttonStyle}
                >
                  {t('actions.save')}
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

const mapStateToProps = (state) => {
  return {
    acrs: state.acrReducer.acrs,
    loading: state.acrReducer.loading,
    permissions: state.authReducer.permissions,
    scripts: state.initReducer.scripts,
  }
}

export default connect(mapStateToProps)(AcrsPage)