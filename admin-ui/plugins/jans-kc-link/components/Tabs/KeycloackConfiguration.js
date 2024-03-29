import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buildPayload, hasPermission, JANS_KC_LINK_WRITE } from 'Utils/PermChecker'
import { putConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import { Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import SharedFooter from '../SharedFooter'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const KeycloackConfiguration = () => {
  const dispatch = useDispatch()
  const configuration = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const permissions = useSelector((state) => state.authReducer.permissions)
  const disabled = !hasPermission(permissions, JANS_KC_LINK_WRITE)

  const userAction = {}
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const { keycloakConfiguration = {} } = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )

  const {
    serverUrl = '',
    realm = '',
    clientId = '',
    clientSecret = '',
    grantType = '',
    username = '',
    password = '',
  } = keycloakConfiguration

  const initialValues = {
    keycloakConfiguration: {
      serverUrl,
      realm,
      clientId,
      clientSecret,
      grantType,
      username,
      password,
    },
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      toggle()
    },
  })

  const submitForm = (userMessage) => {
    toggle()

    buildPayload(userAction, userMessage, {
      appConfiguration4: {
        ...configuration,
        ...formik.values,
      },
    })

    dispatch(putConfiguration({ action: userAction }))
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className='mt-4'
    >
      <FormGroup row>
        <Col sm={12}>
          <GluuInputRow
            label='fields.server_url'
            name='keycloakConfiguration.serverUrl'
            value={formik.values.keycloakConfiguration.serverUrl}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.rrealm'
            name='keycloakConfiguration.realm'
            value={formik.values.keycloakConfiguration.realm}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.client_id'
            name='keycloakConfiguration.clientId'
            value={formik.values.keycloakConfiguration.clientId}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.client_secret'
            name='keycloakConfiguration.clientSecret'
            type='password'
            value={formik.values.keycloakConfiguration.clientSecret}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.grant_type'
            name='keycloakConfiguration.grantType'
            value={formik.values.keycloakConfiguration.grantType}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.username'
            name='keycloakConfiguration.username'
            value={formik.values.keycloakConfiguration.username}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.password'
            name='keycloakConfiguration.password'
            type='password'
            value={formik.values.keycloakConfiguration.password}
            formik={formik}
            lsize={3}
            rsize={9}
            disabled={disabled}
          />
        </Col>
      </FormGroup>

      <SharedFooter disabled={disabled} toggle={toggle} formik={formik} modal={modal} submitForm={submitForm} feature={adminUiFeatures.jans_keycloak_link_write} />
    </Form>
  )
}

export default KeycloackConfiguration