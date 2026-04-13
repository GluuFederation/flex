import { useState, useEffect, useCallback, useMemo } from 'react'
import { Form, FormGroup } from 'Components'
import Toggle from 'react-toggle'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuButton } from '@/components/GluuButton'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toast } from 'react-toastify'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { putConfigWorker } from 'Redux/features/authSlice'
import { SmtpFormValues, SmtpFormProps } from 'Plugins/smtp/types'
import { trimObjectStrings } from 'Utils/Util'
import {
  smtpConstants,
  transformToFormValues,
  toSmtpConfiguration,
  getSmtpValidationSchema,
  buildSmtpChangedFieldOperations,
} from 'Plugins/smtp/helper'
import { BUTTON_STYLES, getButtonColors } from 'Routes/Apps/Gluu/styles/GluuThemeFormFooter.style'
import { useStyles } from './styles/SmtpFormPage.style'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

const SmtpForm = (props: Readonly<SmtpFormProps>) => {
  const {
    item,
    handleSubmit,
    allowSmtpKeystoreEdit,
    onTestSmtp,
    formikRef,
    readOnly,
    testButtonEnabled,
  } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateBack } = useAppNavigation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })
  const buttonColors = useMemo(() => getButtonColors(themeState.theme), [themeState.theme])
  const footerButtonStyle = useMemo(
    () => ({
      minHeight: BUTTON_STYLES.height,
      padding: `${BUTTON_STYLES.paddingY}px ${BUTTON_STYLES.paddingX}px`,
      borderRadius: BUTTON_STYLES.borderRadius,
      fontSize: BUTTON_STYLES.fontSize,
      fontWeight: BUTTON_STYLES.fontWeight,
      letterSpacing: BUTTON_STYLES.letterSpacing,
    }),
    [],
  )

  const [modal, setModal] = useState(false)
  const [commitOperations, setCommitOperations] = useState<
    ReturnType<typeof buildSmtpChangedFieldOperations>
  >([])

  const loadingConfig = useAppSelector((state) => state.authReducer?.loadingConfig)
  const [optimisticKeystoreEdit, setOptimisticKeystoreEdit] = useState(allowSmtpKeystoreEdit)

  useEffect(() => {
    if (!loadingConfig) {
      setOptimisticKeystoreEdit(allowSmtpKeystoreEdit)
    }
  }, [allowSmtpKeystoreEdit, loadingConfig])

  const toggle = useCallback(() => {
    if (readOnly) return
    setModal((prev) => !prev)
  }, [readOnly])

  const initialValues: SmtpFormValues = useMemo(() => transformToFormValues(item), [item])
  const smtpValidationSchema = useMemo(() => getSmtpValidationSchema(t), [t])

  const formik = useFormik<SmtpFormValues>({
    initialValues,
    onSubmit: () => {
      if (readOnly) return
      setCommitOperations(buildSmtpChangedFieldOperations(initialValues, formik.values, t))
      toggle()
    },
    validationSchema: smtpValidationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  })

  const handleApply = useCallback(() => {
    formik.handleSubmit()
  }, [formik])

  useEffect(() => {
    if (formikRef) {
      formikRef.current = formik
    }
  }, [formik, formikRef])

  const handleCancel = useCallback(() => {
    formik.resetForm()
  }, [formik])

  const handleNavigateBack = useCallback(() => {
    navigateBack(ROUTES.HOME_DASHBOARD)
  }, [navigateBack])

  const submitForm = useCallback(
    async (userMessage: string) => {
      if (readOnly) return
      const errors = await formik.validateForm()
      if (Object.keys(errors).length > 0) {
        const touched: Record<string, boolean> = {}
        for (const k of Object.keys(errors)) {
          touched[k] = true
        }
        formik.setTouched(touched)
        toast.error(t('messages.mandatory_fields_required'))
        return
      }
      const { smtp_authentication_account_password, key_store_password, ...rest } = formik.values
      const trimmedRest = trimObjectStrings(
        rest as Record<string, string | number | boolean>,
      ) as Omit<SmtpFormValues, 'smtp_authentication_account_password' | 'key_store_password'>
      const trimmedValues: SmtpFormValues = {
        ...trimmedRest,
        smtp_authentication_account_password,
        key_store_password,
      }
      handleSubmit(toSmtpConfiguration(trimmedValues), userMessage)
    },
    [readOnly, formik, handleSubmit, t],
  )

  const testSmtpConfig = useCallback(() => {
    if (readOnly) return
    if (formik.isValid) {
      onTestSmtp({
        sign: true,
        subject: t('messages.smtp_test_subject'),
        message: t('messages.smtp_test_message'),
      })
    } else {
      toast.error(t('messages.mandatory_fields_required'))
    }
  }, [readOnly, formik.isValid, onTestSmtp, t])

  const keystoreTooltip = useCallback(
    (fieldLabel: string) =>
      !optimisticKeystoreEdit
        ? t('messages.keystore_field_disabled_named', { field: t(fieldLabel) })
        : '',
    [optimisticKeystoreEdit, t],
  )

  const connectProtectionOptions = useMemo(
    () =>
      Object.values(smtpConstants.CONNECT_PROTECTION).map((v) => ({
        value: v,
        label: v,
      })),
    [],
  )

  return (
    <>
      {!readOnly && !optimisticKeystoreEdit && (
        <>
          <GluuTooltip
            tooltipOnly
            doc_entry="keystoreDisabled-key_store"
            content={keystoreTooltip('fields.key_store')}
            place="bottom"
            offset={20}
          />
          <GluuTooltip
            tooltipOnly
            doc_entry="keystoreDisabled-key_store_password"
            content={keystoreTooltip('fields.key_store_password')}
            place="bottom"
            offset={20}
          />
          <GluuTooltip
            tooltipOnly
            doc_entry="keystoreDisabled-key_store_alias"
            content={keystoreTooltip('fields.key_store_alias')}
            place="bottom"
            offset={20}
          />
          <GluuTooltip
            tooltipOnly
            doc_entry="keystoreDisabled-signing_algorithm"
            content={keystoreTooltip('fields.signing_algorithm')}
            place="bottom"
            offset={20}
          />
        </>
      )}
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
        className={classes.formSection}
      >
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.smtp_host"
              name="host"
              value={formik.values.host || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.host && !!formik.errors.host}
              errorMessage={formik.errors.host as string}
              required
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="host"
              placeholder={getFieldPlaceholder(t, 'fields.smtp_host')}
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.smtp_port"
              name="port"
              value={formik.values.port || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.port && !!formik.errors.port}
              errorMessage={formik.errors.port as string}
              type="number"
              required
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="port"
              placeholder={getFieldPlaceholder(t, 'fields.smtp_port')}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuSelectRow
              label="fields.connect_protection"
              name="connect_protection"
              value={formik.values.connect_protection || ''}
              values={connectProtectionOptions}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.connect_protection && !!formik.errors.connect_protection}
              errorMessage={formik.errors.connect_protection as string}
              required
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="connect_protection"
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.from_name"
              name="from_name"
              value={formik.values.from_name || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.from_name && !!formik.errors.from_name}
              errorMessage={formik.errors.from_name as string}
              required
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="from_name"
              placeholder={getFieldPlaceholder(t, 'fields.from_name')}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.from_email_address"
              name="from_email_address"
              value={formik.values.from_email_address || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.from_email_address && !!formik.errors.from_email_address}
              errorMessage={formik.errors.from_email_address as string}
              required
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="from_email_address"
              placeholder={getFieldPlaceholder(t, 'fields.from_email_address')}
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.smtp_user_name"
              name="smtp_authentication_account_username"
              value={formik.values.smtp_authentication_account_username || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={
                formik.touched.smtp_authentication_account_username &&
                !!formik.errors.smtp_authentication_account_username
              }
              errorMessage={formik.errors.smtp_authentication_account_username as string}
              required={formik.values.requires_authentication}
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="smtp_authentication_account_username"
              placeholder={getFieldPlaceholder(t, 'fields.smtp_user_name')}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.smtp_user_password"
              name="smtp_authentication_account_password"
              value={formik.values.smtp_authentication_account_password || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={
                formik.touched.smtp_authentication_account_password &&
                !!formik.errors.smtp_authentication_account_password
              }
              errorMessage={formik.errors.smtp_authentication_account_password as string}
              type="password"
              required={formik.values.requires_authentication}
              disabled={readOnly}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="smtp_authentication_account_password"
              placeholder={getFieldPlaceholder(t, 'fields.smtp_user_password')}
            />
          </div>
          <div className={`${classes.fieldItem} ${classes.fieldItemRelative}`}>
            <GluuInputRow
              label="fields.key_store"
              name="key_store"
              value={formik.values.key_store || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.key_store && !!formik.errors.key_store}
              errorMessage={formik.errors.key_store as string}
              disabled={readOnly || !optimisticKeystoreEdit}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="key_store"
              placeholder={getFieldPlaceholder(t, 'fields.key_store')}
            />
            {!readOnly && !optimisticKeystoreEdit && (
              <div
                className={classes.keystoreOverlay}
                data-tooltip-id="keystoreDisabled-key_store"
              />
            )}
          </div>

          <div className={`${classes.fieldItem} ${classes.fieldItemRelative}`}>
            <GluuInputRow
              label="fields.key_store_password"
              name="key_store_password"
              value={formik.values.key_store_password || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.key_store_password && !!formik.errors.key_store_password}
              errorMessage={formik.errors.key_store_password as string}
              type="password"
              disabled={readOnly || !optimisticKeystoreEdit}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="key_store_password"
              placeholder={getFieldPlaceholder(t, 'fields.key_store_password')}
            />
            {!readOnly && !optimisticKeystoreEdit && (
              <div
                className={classes.keystoreOverlay}
                data-tooltip-id="keystoreDisabled-key_store_password"
              />
            )}
          </div>
          <div className={`${classes.fieldItem} ${classes.fieldItemRelative}`}>
            <GluuInputRow
              label="fields.key_store_alias"
              name="key_store_alias"
              value={formik.values.key_store_alias || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.key_store_alias && !!formik.errors.key_store_alias}
              errorMessage={formik.errors.key_store_alias as string}
              disabled={readOnly || !optimisticKeystoreEdit}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="key_store_alias"
              placeholder={getFieldPlaceholder(t, 'fields.key_store_alias')}
            />
            {!readOnly && !optimisticKeystoreEdit && (
              <div
                className={classes.keystoreOverlay}
                data-tooltip-id="keystoreDisabled-key_store_alias"
              />
            )}
          </div>

          <div className={`${classes.fieldItem} ${classes.fieldItemRelative}`}>
            <GluuInputRow
              label="fields.signing_algorithm"
              name="signing_algorithm"
              value={formik.values.signing_algorithm || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              showError={formik.touched.signing_algorithm && !!formik.errors.signing_algorithm}
              errorMessage={formik.errors.signing_algorithm as string}
              disabled={readOnly || !optimisticKeystoreEdit}
              isDark={isDark}
              doc_category={smtpConstants.DOC_CATEGORY}
              doc_entry="signing_algorithm"
              placeholder={getFieldPlaceholder(t, 'fields.signing_algorithm')}
            />
            {!readOnly && !optimisticKeystoreEdit && (
              <div
                className={classes.keystoreOverlay}
                data-tooltip-id="keystoreDisabled-signing_algorithm"
              />
            )}
          </div>
          <div className={classes.fieldItem}>
            <FormGroup>
              <GluuLabel
                label="fields.trust_host"
                size={12}
                isDark={isDark}
                doc_category={smtpConstants.DOC_CATEGORY}
                doc_entry="trust_host"
              />
              <Toggle
                id="trust_host"
                name="trust_host"
                checked={Boolean(formik.values.trust_host)}
                onChange={(e) => formik.setFieldValue('trust_host', e.target.checked)}
                disabled={readOnly}
              />
            </FormGroup>
          </div>

          <div className={classes.fieldItem}>
            <FormGroup>
              <GluuLabel
                label="fields.allow_keystore_edit"
                size={12}
                isDark={isDark}
                doc_category={smtpConstants.DOC_CATEGORY}
                doc_entry="allowKeystoreEdit"
              />
              <GluuLoader blocking={Boolean(loadingConfig)}>
                <Toggle
                  id="allowKeystoreEdit"
                  name="allowKeystoreEdit"
                  checked={Boolean(optimisticKeystoreEdit)}
                  onChange={(e) => {
                    const checked = e.target.checked
                    if (Boolean(checked) !== Boolean(allowSmtpKeystoreEdit)) {
                      setOptimisticKeystoreEdit(checked)
                      dispatch(
                        putConfigWorker({
                          allowSmtpKeystoreEdit: checked,
                          _meta: {
                            toastMessage: checked
                              ? t('messages.keystore_edit_enabled')
                              : t('messages.keystore_edit_disabled'),
                          },
                        }),
                      )
                    }
                  }}
                  disabled={readOnly || loadingConfig}
                />
              </GluuLoader>
            </FormGroup>
          </div>
          <div className={classes.fieldItem}>
            <FormGroup>
              <GluuLabel
                label="fields.requires_authentication"
                size={12}
                isDark={isDark}
                doc_category={smtpConstants.DOC_CATEGORY}
                doc_entry="requires_authentication"
              />
              <Toggle
                id="requires_authentication"
                name="requires_authentication"
                checked={Boolean(formik.values.requires_authentication)}
                onChange={(e) => formik.setFieldValue('requires_authentication', e.target.checked)}
                disabled={readOnly}
              />
            </FormGroup>
          </div>

          {!readOnly && (
            <div className={classes.testButtonRow}>
              <GluuButton
                type="button"
                onClick={testSmtpConfig}
                disabled={!testButtonEnabled || formik.dirty}
                backgroundColor={buttonColors.cancel.backgroundColor}
                textColor={buttonColors.cancel.textColor}
                borderColor={buttonColors.cancel.borderColor}
                outlined
                useOpacityOnHover
                hoverOpacity={0.85}
                style={footerButtonStyle}
              >
                {t('actions.test')}
              </GluuButton>
            </div>
          )}
        </div>

        <GluuThemeFormFooter
          showBack
          onBack={handleNavigateBack}
          showCancel={!readOnly}
          onCancel={handleCancel}
          disableCancel={!formik.dirty}
          showApply={!readOnly}
          onApply={handleApply}
          disableApply={!formik.isValid || !formik.dirty}
          applyButtonType="button"
          isLoading={formik.isSubmitting ?? false}
        />

        {!readOnly && (
          <GluuCommitDialog
            feature={adminUiFeatures.smtp_configuration_edit}
            handler={toggle}
            modal={modal}
            onAccept={submitForm}
            formik={formik}
            operations={commitOperations}
          />
        )}
      </Form>
    </>
  )
}

export default SmtpForm
