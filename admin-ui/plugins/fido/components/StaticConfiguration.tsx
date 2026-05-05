import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Add, Delete as DeleteIcon } from '@/components/icons'

import { Form, Input } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuWebhookCommitDialog from 'Routes/Apps/Gluu/GluuWebhookCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'

import {
  validationSchema,
  transformToFormValues,
  buildChangedFieldOperations,
  fidoConstants,
  LABEL_SIZE,
  INPUT_SIZE,
  HINT_OPTIONS,
  ATTESTATION_MODE_OPTIONS,
  isLastKeyValueComplete,
  isLastStringEntryComplete,
  isLastMetadataServerComplete,
} from '../helper'
import type { StaticConfigurationProps, StaticConfigFormValues } from '../types'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import { useStyles } from './styles/FidoConfiguration.style'

const StaticConfiguration: React.FC<StaticConfigurationProps> = ({
  fidoConfiguration,
  handleSubmit,
  isSubmitting,
  readOnly,
}) => {
  const { t } = useTranslation()

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)
  const [commitOperations, setCommitOperations] = useState<GluuCommitDialogOperation[]>([])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const initialValues: StaticConfigFormValues = transformToFormValues(
    fidoConfiguration?.fido2Configuration,
    fidoConstants.STATIC,
  ) as StaticConfigFormValues

  const formik = useFormik<StaticConfigFormValues>({
    initialValues,
    onSubmit: readOnly ? () => undefined : toggle,
    validationSchema: validationSchema[fidoConstants.VALIDATION_SCHEMAS.STATIC_CONFIG],
    validateOnMount: true,
  })

  const configSnapshot = useRef<string>('')

  useEffect(() => {
    if (fidoConfiguration?.fido2Configuration) {
      const snapshot = JSON.stringify(fidoConfiguration.fido2Configuration)
      if (snapshot !== configSnapshot.current) {
        configSnapshot.current = snapshot
        formik.resetForm({
          values: transformToFormValues(
            fidoConfiguration.fido2Configuration,
            fidoConstants.STATIC,
          ) as StaticConfigFormValues,
        })
      }
    }
  }, [fidoConfiguration])

  const submitForm = useCallback(
    (userMessage: string) => {
      if (readOnly) {
        return
      }
      handleSubmit(formik.values, userMessage)
    },
    [handleSubmit, formik.values, readOnly],
  )

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (readOnly) {
        return
      }
      formik.handleSubmit()
    },
    [formik, readOnly],
  )

  const requestedParties = useMemo(
    () => formik.values.requestedParties || [],
    [formik.values.requestedParties],
  )
  const enabledFidoAlgorithms = useMemo(
    () => formik.values.enabledFidoAlgorithms || [],
    [formik.values.enabledFidoAlgorithms],
  )
  const metadataServers = useMemo(
    () => formik.values.metadataServers || [],
    [formik.values.metadataServers],
  )

  const addRequestedParty = useCallback(() => {
    formik.setFieldValue('requestedParties', [...requestedParties, { key: '', value: '' }])
  }, [formik, requestedParties])

  const removeRequestedParty = useCallback(
    (index: number) => {
      const updated = [...requestedParties]
      updated.splice(index, 1)
      formik.setFieldValue('requestedParties', updated)
    },
    [formik, requestedParties],
  )

  const changeRequestedParty = useCallback(
    (index: number, field: 'key' | 'value', val: string) => {
      const updated = [...requestedParties]
      updated[index] = { ...updated[index], [field]: val }
      formik.setFieldValue('requestedParties', updated)
    },
    [formik, requestedParties],
  )

  const addAlgorithm = useCallback(() => {
    formik.setFieldValue('enabledFidoAlgorithms', [...enabledFidoAlgorithms, ''])
  }, [formik, enabledFidoAlgorithms])

  const removeAlgorithm = useCallback(
    (index: number) => {
      const updated = [...enabledFidoAlgorithms]
      updated.splice(index, 1)
      formik.setFieldValue('enabledFidoAlgorithms', updated)
    },
    [formik, enabledFidoAlgorithms],
  )

  const changeAlgorithm = useCallback(
    (index: number, val: string) => {
      const updated = [...enabledFidoAlgorithms]
      updated[index] = val
      formik.setFieldValue('enabledFidoAlgorithms', updated)
    },
    [formik, enabledFidoAlgorithms],
  )

  const addMetadataServer = useCallback(() => {
    formik.setFieldValue('metadataServers', [...metadataServers, { url: '', rootCert: '' }])
  }, [formik, metadataServers])

  const removeMetadataServer = useCallback(
    (index: number) => {
      const updated = [...metadataServers]
      updated.splice(index, 1)
      formik.setFieldValue('metadataServers', updated)
    },
    [formik, metadataServers],
  )

  const changeMetadataServer = useCallback(
    (index: number, field: 'url' | 'rootCert', val: string) => {
      const updated = [...metadataServers]
      updated[index] = { ...updated[index], [field]: val }
      formik.setFieldValue('metadataServers', updated)
    },
    [formik, metadataServers],
  )

  const canAddParty = useMemo(() => isLastKeyValueComplete(requestedParties), [requestedParties])
  const canAddAlgorithm = useMemo(
    () => isLastStringEntryComplete(enabledFidoAlgorithms),
    [enabledFidoAlgorithms],
  )
  const canAddServer = useMemo(
    () => isLastMetadataServerComplete(metadataServers),
    [metadataServers],
  )

  const partiesError = formik.errors.requestedParties
  const showPartiesError = typeof partiesError === 'string' && Boolean(partiesError)

  const algorithmsError = formik.errors.enabledFidoAlgorithms
  const showAlgorithmsError = typeof algorithmsError === 'string' && Boolean(algorithmsError)

  const serversError = formik.errors.metadataServers
  const showServersError = typeof serversError === 'string' && Boolean(serversError)

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.AUTHENTICATOR_CERTIFICATES_FOLDER}
              name={fidoConstants.FORM_FIELDS.AUTHENTICATOR_CERTS_FOLDER}
              value={formik.values.authenticatorCertsFolder || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!formik.errors.authenticatorCertsFolder}
              errorMessage={formik.errors.authenticatorCertsFolder}
              placeholder={getFieldPlaceholder(
                t,
                fidoConstants.LABELS.AUTHENTICATOR_CERTIFICATES_FOLDER,
              )}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.MDS_TOC_CERTIFICATES_FOLDER}
              name={fidoConstants.FORM_FIELDS.MDS_CERTS_FOLDER}
              value={formik.values.mdsCertsFolder || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!formik.errors.mdsCertsFolder}
              errorMessage={formik.errors.mdsCertsFolder}
              placeholder={getFieldPlaceholder(t, fidoConstants.LABELS.MDS_TOC_CERTIFICATES_FOLDER)}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.MDS_TOC_FILES_FOLDER}
              name={fidoConstants.FORM_FIELDS.MDS_TOCS_FOLDER}
              value={formik.values.mdsTocsFolder || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!formik.errors.mdsTocsFolder}
              errorMessage={formik.errors.mdsTocsFolder}
              placeholder={getFieldPlaceholder(t, fidoConstants.LABELS.MDS_TOC_FILES_FOLDER)}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.SERVER_METADATA_FOLDER}
              name={fidoConstants.FORM_FIELDS.SERVER_METADATA_FOLDER}
              value={formik.values.serverMetadataFolder || ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!formik.errors.serverMetadataFolder}
              errorMessage={formik.errors.serverMetadataFolder}
              placeholder={getFieldPlaceholder(t, fidoConstants.LABELS.SERVER_METADATA_FOLDER)}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.UNFINISHED_REQUEST_EXPIRATION}
              name={fidoConstants.FORM_FIELDS.UNFINISHED_REQUEST_EXPIRATION}
              type="number"
              value={formik.values.unfinishedRequestExpiration ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!formik.errors.unfinishedRequestExpiration}
              errorMessage={formik.errors.unfinishedRequestExpiration}
              placeholder={getFieldPlaceholder(
                t,
                fidoConstants.LABELS.UNFINISHED_REQUEST_EXPIRATION,
              )}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label={fidoConstants.LABELS.AUTHENTICATION_HISTORY_EXPIRATION}
              name={fidoConstants.FORM_FIELDS.AUTHENTICATION_HISTORY_EXPIRATION}
              type="number"
              value={formik.values.authenticationHistoryExpiration ?? ''}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required
              showError={!!formik.errors.authenticationHistoryExpiration}
              errorMessage={formik.errors.authenticationHistoryExpiration}
              placeholder={getFieldPlaceholder(
                t,
                fidoConstants.LABELS.AUTHENTICATION_HISTORY_EXPIRATION,
              )}
            />
          </div>

          <div className={classes.fieldItemFullWidth}>
            <GluuSelectRow
              label={fidoConstants.LABELS.ATTESTATION_MODE}
              name={fidoConstants.FORM_FIELDS.ATTESTATION_MODE}
              value={formik.values.attestationMode || ''}
              formik={formik}
              values={ATTESTATION_MODE_OPTIONS}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              required={true}
              showError={!!formik.errors.attestationMode}
              errorMessage={formik.errors.attestationMode}
              handleChange={(_e) => {
                formik.setFieldTouched(fidoConstants.FORM_FIELDS.ATTESTATION_MODE, true, false)
              }}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.USER_AUTO_ENROLLMENT}
              name={fidoConstants.FORM_FIELDS.USER_AUTO_ENROLLMENT}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.DISABLE_METADATA_SERVICE}
              name={fidoConstants.FORM_FIELDS.DISABLE_METADATA_SERVICE}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuToggleRow
              label={fidoConstants.LABELS.ENTERPRISE_ATTESTATION}
              name={fidoConstants.FORM_FIELDS.ENTERPRISE_ATTESTATION}
              formik={formik}
              lsize={LABEL_SIZE}
              rsize={INPUT_SIZE}
              doc_category={fidoConstants.DOC_CATEGORY}
            />
          </div>
        </div>

        <div
          className={`${classes.propsBox} ${classes.propsBoxWithMargin} mb-3 ${!requestedParties.length ? classes.propsBoxEmpty : ''}`.trim()}
        >
          <div
            className={`${classes.propsHeader} ${!requestedParties.length ? classes.propsHeaderEmpty : ''}`.trim()}
          >
            <GluuText variant="h5" disableThemeColor>
              <span className={classes.propsTitle}>
                {t(fidoConstants.LABELS.REQUESTED_PARTIES_ID)}
              </span>
            </GluuText>
            <GluuButton
              type="button"
              backgroundColor={themeColors.settings.addPropertyButton.bg}
              textColor={themeColors.settings.addPropertyButton.text}
              useOpacityOnHover
              className={classes.propsActionBtn}
              onClick={addRequestedParty}
              disabled={!canAddParty}
            >
              <Add fontSize="small" />
              {t(fidoConstants.BUTTON_TEXT.ADD_PARTY)}
            </GluuButton>
          </div>
          <div className={classes.propsBody}>
            {requestedParties.map((item, index) => (
              <div key={index} className={classes.propsRow}>
                <Input
                  value={item.key || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeRequestedParty(index, 'key', e.target.value)
                  }
                  placeholder={t('placeholders.name')}
                  className={classes.propsInput}
                />
                <Input
                  value={item.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeRequestedParty(index, 'value', e.target.value)
                  }
                  placeholder={t('placeholders.value')}
                  className={classes.propsInput}
                />
                <GluuButton
                  type="button"
                  backgroundColor={themeColors.settings.removeButton.bg}
                  textColor={themeColors.settings.removeButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={() => removeRequestedParty(index)}
                >
                  <DeleteIcon className={classes.propsActionIcon} />
                  {t('actions.remove')}
                </GluuButton>
              </div>
            ))}
            {showPartiesError && (
              <div className={classes.propsError}>{t(partiesError as string)}</div>
            )}
          </div>
        </div>

        <div
          className={`${classes.propsBox} ${classes.propsBoxWithMargin} mb-3 ${!enabledFidoAlgorithms.length ? classes.propsBoxEmpty : ''}`.trim()}
        >
          <div
            className={`${classes.propsHeader} ${!enabledFidoAlgorithms.length ? classes.propsHeaderEmpty : ''}`.trim()}
          >
            <GluuText variant="h5" disableThemeColor>
              <span className={classes.propsTitle}>
                {t(fidoConstants.LABELS.ENABLED_FIDO_ALGORITHMS)}
              </span>
            </GluuText>
            <GluuButton
              type="button"
              backgroundColor={themeColors.settings.addPropertyButton.bg}
              textColor={themeColors.settings.addPropertyButton.text}
              useOpacityOnHover
              className={classes.propsActionBtn}
              onClick={addAlgorithm}
              disabled={!canAddAlgorithm}
            >
              <Add fontSize="small" />
              {t(fidoConstants.BUTTON_TEXT.ADD_ALGORITHM)}
            </GluuButton>
          </div>
          <div className={classes.propsBody}>
            {enabledFidoAlgorithms.map((item, index) => (
              <div key={index} className={classes.propsRow}>
                <Input
                  value={item || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeAlgorithm(index, e.target.value)
                  }
                  placeholder={t('placeholders.value')}
                  className={classes.propsInput}
                />
                <GluuButton
                  type="button"
                  backgroundColor={themeColors.settings.removeButton.bg}
                  textColor={themeColors.settings.removeButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={() => removeAlgorithm(index)}
                >
                  <DeleteIcon className={classes.propsActionIcon} />
                  {t('actions.remove')}
                </GluuButton>
              </div>
            ))}
            {showAlgorithmsError && (
              <div className={classes.propsError}>{t(algorithmsError as string)}</div>
            )}
          </div>
        </div>

        <div
          className={`${classes.propsBox} ${classes.propsBoxWithMargin} mb-3 ${!metadataServers.length ? classes.propsBoxEmpty : ''}`.trim()}
        >
          <div
            className={`${classes.propsHeader} ${!metadataServers.length ? classes.propsHeaderEmpty : ''}`.trim()}
          >
            <GluuText variant="h5" disableThemeColor>
              <span className={classes.propsTitle}>{t(fidoConstants.LABELS.METADATA_SERVERS)}</span>
            </GluuText>
            <GluuButton
              type="button"
              backgroundColor={themeColors.settings.addPropertyButton.bg}
              textColor={themeColors.settings.addPropertyButton.text}
              useOpacityOnHover
              className={classes.propsActionBtn}
              onClick={addMetadataServer}
              disabled={!canAddServer}
            >
              <Add fontSize="small" />
              {t(fidoConstants.BUTTON_TEXT.ADD_METADATA_SERVER)}
            </GluuButton>
          </div>
          <div className={classes.propsBody}>
            {metadataServers.map((server, index) => (
              <div key={index} className={classes.propsRow}>
                <Input
                  value={server.url || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeMetadataServer(index, 'url', e.target.value)
                  }
                  placeholder={t('placeholders.enter_url')}
                  className={classes.propsInput}
                />
                <Input
                  value={server.rootCert || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeMetadataServer(index, 'rootCert', e.target.value)
                  }
                  placeholder={t('placeholders.enter_root_certificate')}
                  className={classes.propsInput}
                />
                <GluuButton
                  type="button"
                  backgroundColor={themeColors.settings.removeButton.bg}
                  textColor={themeColors.settings.removeButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={() => removeMetadataServer(index)}
                >
                  <DeleteIcon className={classes.propsActionIcon} />
                  {t('actions.remove')}
                </GluuButton>
              </div>
            ))}
            {showServersError && (
              <div className={classes.propsError}>{t(serversError as string)}</div>
            )}
          </div>
        </div>

        <div className={`${classes.formLabels} ${classes.formWithInputs} ${classes.hintsSection}`}>
          <GluuMultiSelectRow
            label={fidoConstants.LABELS.HINTS}
            name={fidoConstants.FORM_FIELDS.HINTS}
            value={formik.values.hints || []}
            formik={formik}
            options={HINT_OPTIONS}
            lsize={LABEL_SIZE}
            rsize={INPUT_SIZE}
            required
            showError={!!formik.errors.hints}
            errorMessage={formik.errors.hints as string}
            doc_category={fidoConstants.DOC_CATEGORY}
            helperText={t('messages.multi_select_hint')}
          />
        </div>
      </div>

      <GluuThemeFormFooter
        showBack
        showCancel
        showApply={!readOnly}
        onApply={() => {
          const ops = buildChangedFieldOperations(
            initialValues,
            formik.values,
            fidoConstants.STATIC,
            t,
          )
          setCommitOperations(ops)
          toggle()
        }}
        onCancel={handleCancel}
        disableCancel={!formik.dirty}
        disableApply={!formik.isValid || !formik.dirty}
        applyButtonType="button"
        isLoading={isSubmitting ?? false}
      />

      {!readOnly && (
        <GluuWebhookCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik}
          operations={commitOperations}
          webhookFeature={adminUiFeatures.fido_configuration_write}
        />
      )}
    </Form>
  )
}

export default React.memo(StaticConfiguration)
