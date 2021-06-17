import React, { useEffect } from 'react'
import { Form, Button } from '../../../../../app/components'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import { getAcrsConfig, editAcrs } from '../../../redux/actions/AcrsActions'
import {
  hasPermission,
  ACR_READ,
  ACR_WRITE,
} from '../../../../../app/utils/PermChecker'
import { SIMPLE_PASSWORD_AUTH } from '../../../common/Constants'
import GluuSelectRow from '../../../../../app/routes/Apps/Gluu/GluuSelectRow'
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
            <GluuSelectRow
              label="fields.default_acr"
              name="defaultAcr"
              value={acrs.defaultAcr}
              formik={formik}
              lsize={4}
              rsize={8}
              values={authScripts}
              required
            ></GluuSelectRow>

            {hasPermission(permissions, ACR_WRITE) && (
              <Button color="primary" type="submit">
                {t('actions.save')}
              </Button>
            )}
          </Form>
        )}
      </Formik>
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
