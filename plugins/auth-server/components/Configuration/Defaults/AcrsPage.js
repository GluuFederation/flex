import React, { useEffect } from 'react'
import { Form, Button } from '../../../../../app/components'
import BlockUi from 'react-block-ui'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import { getAcrsConfig, editAcrs } from '../../../redux/actions/AcrsActions'
import {
  hasPermission,
  ACR_READ,
  ACR_WRITE,
} from '../../../../../app/utils/PermChecker'
import GluuSelectRow from '../../../../../app/routes/Apps/Gluu/GluuSelectRow'
import { useTranslation } from 'react-i18next'

function AcrsPage({ acrs, scripts, permissions, loading, dispatch }) {
  const { t } = useTranslation()
  const authScripts = scripts
    .filter((item) => item.scriptType == 'PERSON_AUTHENTICATION')
    .filter((item) => item.enabled)
    .map((item) => item.name)
  authScripts.push('simple_password_auth')
  useEffect(() => {
    dispatch(getAcrsConfig())
  }, [])
  const initialValues = {
    defaultAcr: acrs.defaultAcr,
  }
  return (
    <React.Fragment>
      <BlockUi
        tag="div"
        blocking={loading}
        keepInView={true}
        renderChildren={true}
        message={t("Performing the request, please wait!")}
      >
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
                label={t("Default Authentication Method(Acr)")}
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
                  Save
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </BlockUi>
    </React.Fragment>
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
