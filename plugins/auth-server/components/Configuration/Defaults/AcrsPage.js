import React, { useEffect } from 'react'
import { Form, Button, FormGroup, Col, CustomInput } from '../../../../../app/components'
import { Formik } from 'formik'
import GluuLabel from '../../../../../app/routes/Apps/Gluu/GluuLabel'
import { connect } from 'react-redux'
import { getAcrsConfig, editAcrs } from '../../../redux/actions/AcrsActions'
import {
  hasPermission,
  ACR_READ,
  ACR_WRITE,
} from '../../../../../app/utils/PermChecker'
import { SIMPLE_PASSWORD_AUTH } from '../../../common/Constants'
import GluuViewWrapper from '../../../../../app/routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from '../../../../../app/routes/Apps/Gluu/GluuLoader'
import { useTranslation } from 'react-i18next'

function AcrsPage({ acrs, scripts, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const authScripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => item.name)
  authScripts.push(SIMPLE_PASSWORD_AUTH)
  useEffect(() => {
    dispatch(getAcrsConfig())
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
              <FormGroup row>
                <GluuLabel label="fields.default_acr" size={4} />
                <Col sm={8}>
                  <CustomInput
                    type="select"
                    id="defaultAcr"
                    name="defaultAcr"
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

              {hasPermission(permissions, ACR_WRITE) && (
                <Button color="primary" type="submit">
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
    permissions: state.authReducer.permissions,
    scripts: state.customScriptReducer.items,
    loading: state.acrReducer.loading,
  }
}

export default connect(mapStateToProps)(AcrsPage)
