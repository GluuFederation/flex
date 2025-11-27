import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buildPayload } from 'Utils/PermChecker'
import { Col, Form, Row } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { useFormik } from 'formik'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import {
  editMessageConfig,
  putConfigMessagePostgres,
  putConfigMessageRedis,
} from 'Plugins/auth-server/redux/features/MessageSlice'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

const POSTGRES = 'POSTGRES'
const REDIS = 'REDIS'
const DISABLED = 'DISABLED'

const MessageForm = () => {
  const { t } = useTranslation()

  const config = useSelector((state) => state.messageReducer.config)

  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)

  const toggle = () => {
    setModal(!modal)
  }

  const isDisabled = false

  const formik = useFormik({
    initialValues: config,
    onSubmit: (values) => {
      if (values.messageProviderType) {
        toggle()
      }
    },
    validationSchema: Yup.object().shape({
      messageProviderType: Yup.string().required(t('messages.select_message_provider_type')),
    }),
  })

  const submitForm = (userMessage) => {
    toggle()

    if (config.messageProviderType !== formik.values.messageProviderType) {
      // save provider type
      const userAction = {}
      const postBody = {}
      postBody['requestBody'] = [
        {
          op: 'replace',
          path: '/messageProviderType',
          value: formik.values.messageProviderType,
        },
      ]
      buildPayload(userAction, userMessage, postBody)
      dispatch(editMessageConfig(userAction))
    }

    if (formik.values.messageProviderType === REDIS) {
      // put-config-message-redis
      const userAction = {}
      buildPayload(userAction, userMessage, formik.values.redisConfiguration)

      dispatch(putConfigMessageRedis(userAction))
    }

    if (formik.values.messageProviderType === POSTGRES) {
      // put-config-message-postgres
      const userAction = {}
      buildPayload(userAction, userMessage, formik.values.postgresConfiguration)

      dispatch(putConfigMessagePostgres(userAction))
    }
  }

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Col sm={12}>
          <GluuSelectRow
            label="fields.message_provider_type"
            formik={formik}
            value={formik.values.messageProviderType}
            values={[
              { value: DISABLED, label: DISABLED },
              { value: REDIS, label: REDIS },
              { value: POSTGRES, label: POSTGRES },
            ]}
            lsize={4}
            rsize={8}
            name="messageProviderType"
            disabled={isDisabled}
            showError={formik.errors.messageProviderType && formik.touched.messageProviderType}
            errorMessage={formik.errors.messageProviderType}
          />
        </Col>

        {formik.values.messageProviderType === REDIS && (
          <Col sm={12}>
            <GluuSelectRow
              label="fields.redis_provider_type"
              formik={formik}
              value={formik.values.redisConfiguration?.redisProviderType}
              values={[
                { value: 'STANDALONE', label: 'STANDALONE' },
                { value: 'CLUSTER', label: 'CLUSTER' },
                { value: 'SHARDED', label: 'SHARDED' },
                { value: 'SENTINEL', label: 'SENTINEL' },
              ]}
              lsize={4}
              rsize={8}
              name="redisConfiguration.redisProviderType"
              disabled={isDisabled}
            />
            <GluuInputRow
              label="fields.servers"
              formik={formik}
              disabled={isDisabled}
              value={formik.values.redisConfiguration?.servers}
              lsize={4}
              rsize={8}
              name="redisConfiguration.servers"
            />
            <GluuInputRow
              label="fields.default_put_expiration"
              formik={formik}
              disabled={isDisabled}
              value={formik.values.redisConfiguration?.defaultPutExpiration}
              lsize={4}
              rsize={8}
              type="number"
              name="redisConfiguration.defaultPutExpiration"
            />
            <GluuInputRow
              label="fields.sentinel_master_group_name_message"
              formik={formik}
              disabled={isDisabled}
              value={formik.values.redisConfiguration?.sentinelMasterGroupName}
              lsize={4}
              rsize={8}
              name="redisConfiguration.sentinelMasterGroupName"
            />
            <GluuInputRow
              label="fields.password"
              formik={formik}
              disabled={isDisabled}
              value={formik.values.redisConfiguration?.password}
              lsize={4}
              rsize={8}
              name="redisConfiguration.password"
            />
            <GluuToogleRow
              label="fields.use_ssl"
              formik={formik}
              disabled={isDisabled}
              value={formik.values.redisConfiguration?.useSSL}
              lsize={4}
              rsize={8}
              name="redisConfiguration.useSSL"
              handler={(e) => {
                formik.setFieldValue('redisConfiguration.useSSL', e.target.checked)
              }}
            />
            <GluuInputRow
              label="fields.ssl_key_store_file_path"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.sslKeyStoreFilePath"
              value={formik.values.redisConfiguration?.sslKeyStoreFilePath}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.ssl_trust_store_file_path_message"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.sslTrustStoreFilePath"
              value={formik.values.redisConfiguration?.sslTrustStoreFilePath}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.ssl_trust_store_password"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.sslTrustStorePassword"
              value={formik.values.redisConfiguration?.sslTrustStorePassword}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.ssl_key_store_password"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.sslKeyStorePassword"
              value={formik.values.redisConfiguration?.sslKeyStorePassword}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.max_idle_connections"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.maxIdleConnections"
              value={formik.values.redisConfiguration?.maxIdleConnections}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.max_total_connections"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.maxTotalConnections"
              value={formik.values.redisConfiguration?.maxTotalConnections}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.connection_timeout"
              formik={formik}
              name="redisConfiguration.connectionTimeout"
              disabled={isDisabled}
              value={formik.values.redisConfiguration?.connectionTimeout}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.so_timeout"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.soTimeout"
              value={formik.values.redisConfiguration?.soTimeout}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.max_retry_attempts"
              formik={formik}
              disabled={isDisabled}
              name="redisConfiguration.maxRetryAttempts"
              value={formik.values.redisConfiguration?.maxRetryAttempts}
              lsize={4}
              rsize={8}
              type="number"
            />
          </Col>
        )}

        {formik.values.messageProviderType === POSTGRES && (
          <>
            <GluuInputRow
              label="fields.driver_class_name"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.driverClassName"
              value={formik.values.postgresConfiguration?.driverClassName}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.db_schema_name"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.dbSchemaName"
              value={formik.values.postgresConfiguration?.dbSchemaName}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.connection_uri"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.connectionUri"
              value={formik.values.postgresConfiguration?.connectionUri}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.auth_user_name"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.authUserName"
              value={formik.values.postgresConfiguration?.authUserName}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.auth_user_password"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.authUserPassword"
              value={formik.values.postgresConfiguration?.authUserPassword}
              lsize={4}
              rsize={8}
            />
            <GluuInputRow
              label="fields.connection_pool_max_total"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.connectionPoolMaxTotal"
              value={formik.values.postgresConfiguration?.connectionPoolMaxTotal}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.connection_pool_max_idle"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.connectionPoolMaxIdle"
              value={formik.values.postgresConfiguration?.connectionPoolMaxIdle}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.connection_pool_min_idle"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.connectionPoolMinIdle"
              value={formik.values.postgresConfiguration?.connectionPoolMinIdle}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.message_wait_millis"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.messageWaitMillis"
              value={formik.values.postgresConfiguration?.messageWaitMillis}
              lsize={4}
              rsize={8}
              type="number"
            />
            <GluuInputRow
              label="fields.message_sleep_thread_time"
              formik={formik}
              disabled={isDisabled}
              name="postgresConfiguration.messageSleepThreadTime"
              value={formik.values.postgresConfiguration?.messageSleepThreadTime}
              lsize={4}
              rsize={8}
              type="number"
            />
          </>
        )}

        <Row>
          <Col>
            <GluuCommitFooter
              saveHandler={toggle}
              hideButtons={{ save: true, back: false }}
              type="submit"
            />
          </Col>
        </Row>
      </Form>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </>
  )
}

export default MessageForm
