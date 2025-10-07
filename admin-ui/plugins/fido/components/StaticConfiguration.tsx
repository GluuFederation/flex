import React, { useState, useCallback, useMemo } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'

import { Row, Col, Form, FormGroup } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'

import { adminUiFeatures } from 'Plugins/admin/helper/utils'

import {
  validationSchema,
  transformToFormValues,
  fidoConstants,
  getAvailableHintOptions,
  getEmptyDropdownMessage,
} from '../helper'
import { StaticConfigurationProps, StaticConfigFormValues } from '../types/fido-types'

const StaticConfiguration: React.FC<StaticConfigurationProps> = ({
  fidoConfiguration,
  handleSubmit,
  isSubmitting,
}) => {
  const staticConfiguration = fidoConfiguration?.fido2Configuration

  const { t } = useTranslation()

  const [modal, setModal] = useState(false)

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const formik = useFormik<StaticConfigFormValues>({
    initialValues: transformToFormValues(
      staticConfiguration,
      fidoConstants.STATIC,
    ) as StaticConfigFormValues,
    onSubmit: toggle,
    validationSchema: validationSchema[fidoConstants.VALIDATION_SCHEMAS.STATIC_CONFIG],
    enableReinitialize: true,
  })

  const submitForm = useCallback(() => {
    toggle()
    handleSubmit(formik.values)
  }, [handleSubmit, toggle, formik.values])

  const requestedPartiesOptions = useMemo(() => {
    return (formik.values.requestedParties || []).map((item) => ({
      key: item.key || '',
      value: item.value || '',
    }))
  }, [formik.values.requestedParties])

  const enabledFidoAlgorithmsOptions = useMemo(() => {
    return (formik.values.enabledFidoAlgorithms || []).map((item) => ({
      key: '',
      value: item,
    }))
  }, [formik.values.enabledFidoAlgorithms])

  const metadataServersOptions = useMemo(() => {
    return (formik.values.metadataServers || []).map((server) => ({
      key: server.url || '',
      value: server.rootCert || '',
    }))
  }, [formik.values.metadataServers])

  // Create a wrapper formik that transforms metadata servers between key/value and url/rootCert
  const metadataServersFormik = useMemo(() => {
    const setFieldValueWrapper = (name: string, value: any) => {
      if (name === fidoConstants.FORM_FIELDS.METADATA_SERVERS) {
        // Transform {key, value} back to {url, rootCert}
        const transformedValue = value.map((item: any) => ({
          url: item.key || '',
          rootCert: item.value || '',
        }))
        formik.setFieldValue(name, transformedValue)
      } else {
        formik.setFieldValue(name, value)
      }
    }

    return {
      ...formik,
      setFieldValue: setFieldValueWrapper,
    }
  }, [formik.values, formik.errors, formik.touched])

  const availableHintOptions = useMemo(() => {
    return getAvailableHintOptions(formik.values.hints)
  }, [formik.values.hints])

  const emptyDropdownMessage = useMemo(() => {
    return getEmptyDropdownMessage(formik.values.hints)
  }, [formik.values.hints])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik],
  )

  return (
    <Form onSubmit={handleFormSubmit} className="mt-4">
      <FormGroup row>
        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.AUTHENTICATOR_CERTIFICATES_FOLDER}
            name={fidoConstants.FORM_FIELDS.AUTHENTICATOR_CERTS_FOLDER}
            value={formik.values.authenticatorCertsFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(formik.errors.authenticatorCertsFolder && formik.touched.authenticatorCertsFolder)
            }
            errorMessage={formik.errors.authenticatorCertsFolder}
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.MDS_TOC_CERTIFICATES_FOLDER}
            name="mdsCertsFolder"
            value={formik.values.mdsCertsFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={!!(formik.errors.mdsCertsFolder && formik.touched.mdsCertsFolder)}
            errorMessage={formik.errors.mdsCertsFolder}
          />
        </Col>
        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.MDS_TOC_FILES_FOLDER}
            name="mdsTocsFolder"
            value={formik.values.mdsTocsFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={!!(formik.errors.mdsTocsFolder && formik.touched.mdsTocsFolder)}
            errorMessage={formik.errors.mdsTocsFolder}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.UNFINISHED_REQUEST_EXPIRATION}
            name="unfinishedRequestExpiration"
            type="number"
            value={formik.values.unfinishedRequestExpiration ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(
                formik.errors.unfinishedRequestExpiration &&
                formik.touched.unfinishedRequestExpiration
              )
            }
            errorMessage={formik.errors.unfinishedRequestExpiration}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.AUTHENTICATION_HISTORY_EXPIRATION}
            name="authenticationHistoryExpiration"
            type="number"
            value={formik.values.authenticationHistoryExpiration ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(
                formik.errors.authenticationHistoryExpiration &&
                formik.touched.authenticationHistoryExpiration
              )
            }
            errorMessage={formik.errors.authenticationHistoryExpiration}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.SERVER_METADATA_FOLDER}
            name="serverMetadataFolder"
            value={formik.values.serverMetadataFolder || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(formik.errors.serverMetadataFolder && formik.touched.serverMetadataFolder)
            }
            errorMessage={formik.errors.serverMetadataFolder}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.USER_AUTO_ENROLLMENT}
            name={fidoConstants.FORM_FIELDS.USER_AUTO_ENROLLMENT}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <Row className="mt-2">
            <GluuLabel label={fidoConstants.LABELS.REQUESTED_PARTIES_ID} size={4} />
            <Col sm={8}>
              <GluuProperties
                compName={fidoConstants.FORM_FIELDS.REQUESTED_PARTIES}
                isInputLables={true}
                keyLabel={t('fields.name')}
                valueLabel={t('fields.domain')}
                formik={formik}
                options={requestedPartiesOptions}
                keyPlaceholder={t('placeholders.name')}
                valuePlaceholder={t('placeholders.value')}
                buttonText={fidoConstants.BUTTON_TEXT.ADD_PARTY}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.METADATA_REFRESH_INTERVAL}
            name={fidoConstants.FORM_FIELDS.METADATA_REFRESH_INTERVAL}
            type="number"
            value={formik.values.metadataRefreshInterval ?? ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={
              !!(formik.errors.metadataRefreshInterval && formik.touched.metadataRefreshInterval)
            }
            errorMessage={formik.errors.metadataRefreshInterval}
          />
        </Col>

        <Col sm={8}>
          <Row>
            <GluuLabel label={fidoConstants.LABELS.ENABLED_FIDO_ALGORITHMS} size={4} />
            <Col sm={8}>
              <GluuProperties
                compName={fidoConstants.FORM_FIELDS.ENABLED_FIDO_ALGORITHMS}
                isInputLables={true}
                formik={formik}
                options={enabledFidoAlgorithmsOptions}
                isKeys={false}
                buttonText={fidoConstants.BUTTON_TEXT.ADD_ALGORITHM}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={8}>
          <Row className="mt-2">
            <GluuLabel label={fidoConstants.LABELS.METADATA_SERVERS} size={4} />
            <Col sm={8}>
              <GluuProperties
                compName={fidoConstants.FORM_FIELDS.METADATA_SERVERS}
                isInputLables={true}
                keyLabel="URL"
                valueLabel="Root Certificate"
                formik={metadataServersFormik}
                options={metadataServersOptions}
                keyPlaceholder="Enter URL"
                valuePlaceholder="Enter Root Certificate"
                buttonText={fidoConstants.BUTTON_TEXT.ADD_METADATA_SERVER}
              />
            </Col>
          </Row>
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.DISABLE_METADATA_SERVICE}
            name={fidoConstants.FORM_FIELDS.DISABLE_METADATA_SERVICE}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuTypeAhead
            name={fidoConstants.FORM_FIELDS.HINTS}
            label={fidoConstants.LABELS.HINTS}
            formik={formik}
            value={formik.values.hints || []}
            options={availableHintOptions}
            lsize={4}
            rsize={8}
            showError={!!(formik.errors.hints && formik.touched.hints)}
            errorMessage={formik.errors.hints}
            doc_category={fidoConstants.DOC_CATEGORY}
            emptyLabel={emptyDropdownMessage}
            allowNew={false}
          />
        </Col>

        <Col sm={8}>
          <GluuToggleRow
            label={fidoConstants.LABELS.ENTERPRISE_ATTESTATION}
            name={fidoConstants.FORM_FIELDS.ENTERPRISE_ATTESTATION}
            formik={formik}
            lsize={4}
            rsize={8}
            doc_category={fidoConstants.DOC_CATEGORY}
          />
        </Col>

        <Col sm={8}>
          <GluuInputRow
            label={fidoConstants.LABELS.ATTESTATION_MODE}
            name={fidoConstants.FORM_FIELDS.ATTESTATION_MODE}
            value={formik.values.attestationMode || ''}
            formik={formik}
            lsize={4}
            rsize={8}
            showError={!!(formik.errors.attestationMode && formik.touched.attestationMode)}
            errorMessage={formik.errors.attestationMode}
          />
        </Col>
      </FormGroup>

      <Row>
        <Col>
          <GluuCommitFooter
            saveHandler={toggle}
            hideButtons={{ save: true, back: false }}
            type="submit"
            disabled={isSubmitting}
          />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        feature={adminUiFeatures.fido_configuration_write}
        onAccept={submitForm}
        formik={formik}
      />
    </Form>
  )
}

export default React.memo(StaticConfiguration)
