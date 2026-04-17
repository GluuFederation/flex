import { useState, useCallback, useMemo, useRef, type ReactElement, type FormEvent } from 'react'
import { useFormik, type FormikProps } from 'formik'
import { Form, Input } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { GluuButton } from '@/components/GluuButton'
import { useTranslation } from 'react-i18next'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useLocation } from 'react-router-dom'
import { useGetAcrs } from 'JansConfigApi'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { type AuthNItem } from '../atoms'
import { getAuthNValidationSchema } from './helper/validations'
import { useStyles } from './AcrsForm.style'
import { HASH_ALGORITHM_OPTIONS, DEFAULT_AUTHN_OPTIONS } from './constants'
import { getPropertiesConfig, type PropertyConfig } from './helper/acrUtils'

export type AcrsFormValues = {
  acr: string
  level: number
  defaultAuthNMethod: boolean | string
  samlACR: string
  description: string
  primaryKey: string
  passwordAttribute: string
  hashAlgorithm: string
  bindDN: string
  maxConnections: string | number
  remotePrimaryKey: string
  localPrimaryKey: string
  servers: string[]
  baseDNs: string[]
  bindPassword: string
  useSSL: boolean
  enabled: boolean
  configId: string
  baseDn: string | undefined
  inum: string | undefined
  configurationProperties?: Array<{
    id?: string
    key?: string
    value?: string
    value1?: string
    value2?: string
  }>
}

type AcrsFormProps = {
  item: AuthNItem
  handleSubmit: (values: AcrsFormValues) => void
  isSubmitting?: boolean
}

const AcrsForm = ({ item, handleSubmit, isSubmitting = false }: AcrsFormProps): ReactElement => {
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const location = useLocation()
  const authnTab: number = (location.state as { authnTab?: number } | null)?.authnTab ?? 0
  const [modal, setModal] = useState(false)

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { data: acrs } = useGetAcrs({ query: { staleTime: 30000 } })

  const initialValues: AcrsFormValues = useMemo(
    () => ({
      acr: item?.acrName || '',
      level: parseInt(String(item.level)) || 0,
      defaultAuthNMethod: acrs?.defaultAcr === item.acrName,
      samlACR: item?.samlACR || '',
      description: item?.description || '',
      primaryKey: item?.primaryKey || '',
      passwordAttribute: item?.passwordAttribute || '',
      hashAlgorithm: item?.hashAlgorithm || '',
      bindDN: item?.bindDN || '',
      maxConnections: item?.maxConnections || '',
      remotePrimaryKey: item?.primaryKey || '',
      localPrimaryKey: item?.localPrimaryKey || '',
      servers: Array.isArray(item?.servers) ? item.servers : item?.servers ? [item.servers] : [],
      baseDNs: Array.isArray(item?.baseDNs) ? item.baseDNs : item?.baseDNs ? [item.baseDNs] : [],
      bindPassword: item?.bindPassword || '',
      useSSL: item?.useSSL || false,
      enabled: item?.enabled || false,
      configId: item?.configId || '',
      baseDn: item?.baseDn,
      inum: item?.inum,
      configurationProperties: getPropertiesConfig(item),
    }),
    [item, acrs?.defaultAcr],
  )

  const validationSchema = useMemo(() => getAuthNValidationSchema(item), [item])

  const formik: FormikProps<AcrsFormValues> = useFormik<AcrsFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      toggle()
    },
  })

  const formikValuesRef = useRef(formik.values)
  formikValuesRef.current = formik.values

  const toggle = useCallback((): void => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    (_userMessage: string): void => {
      toggle()
      handleSubmit(formikValuesRef.current)
    },
    [toggle, handleSubmit],
  )

  const handleApply = useCallback((): void => {
    if (isSubmitting || !formik.dirty || !formik.isValid) return
    toggle()
  }, [isSubmitting, formik.dirty, formik.isValid, toggle])

  const handleNavigateBack = useCallback((): void => {
    navigateToRoute(ROUTES.AUTH_SERVER_AUTHN, { state: { authnTab } })
  }, [navigateToRoute, authnTab])

  const handleCancel = useCallback((): void => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const configurationProperties = useMemo(
    () => (formik.values.configurationProperties as PropertyConfig[]) || [],
    [formik.values.configurationProperties],
  )

  const canAddProperty = useMemo(
    () =>
      configurationProperties.length === 0 ||
      !!(
        configurationProperties[configurationProperties.length - 1]?.key &&
        configurationProperties[configurationProperties.length - 1]?.value
      ),
    [configurationProperties],
  )

  const addConfigProperty = useCallback(() => {
    formik.setFieldValue('configurationProperties', [
      ...configurationProperties,
      { id: crypto.randomUUID(), key: '', value: '' },
    ])
  }, [formik, configurationProperties])

  const removeConfigProperty = useCallback(
    (id: string) => {
      formik.setFieldValue(
        'configurationProperties',
        configurationProperties.filter((p) => p.id !== id),
      )
    },
    [formik, configurationProperties],
  )

  const changeConfigProperty = useCallback(
    (id: string, field: 'key' | 'value', val: string) => {
      formik.setFieldValue(
        'configurationProperties',
        configurationProperties.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
      )
    },
    [formik, configurationProperties],
  )

  const isSimplePassword = item.name === 'simple_password_auth'
  const isLdap = item.name === 'default_ldap_password'
  const isScript = !!item.isCustomScript
  const showSamlAndDescription = isSimplePassword || isScript

  return (
    <Form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
    >
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />

      <div className={`${classes.formLabels} ${classes.formWithInputs}`}>
        <div className={classes.formGrid}>
          <div className={classes.fieldItem}>
            <GluuInputRow
              name="acr"
              label="fields.acr"
              value={formik.values.acr || ''}
              formik={formik}
              lsize={12}
              rsize={12}
              disabled={true}
              showError={!!(formik.errors.acr && formik.touched.acr)}
              errorMessage={formik.errors.acr}
              required={true}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuInputRow
              name="level"
              label="fields.level"
              value={formik.values.level ?? ''}
              formik={formik}
              lsize={12}
              rsize={12}
              type="number"
              disabled={isSimplePassword}
              showError={!!(formik.errors.level && formik.touched.level)}
              errorMessage={formik.errors.level}
              required={true}
            />
          </div>

          <div className={classes.fieldItem}>
            <GluuSelectRow
              name="defaultAuthNMethod"
              label="fields.default_authn_method"
              value={String(formik.values.defaultAuthNMethod)}
              formik={formik}
              lsize={12}
              rsize={12}
              values={DEFAULT_AUTHN_OPTIONS}
              showError={!!(formik.errors.defaultAuthNMethod && formik.touched.defaultAuthNMethod)}
              errorMessage={formik.errors.defaultAuthNMethod}
            />
          </div>

          {showSamlAndDescription && (
            <div className={classes.fieldItem}>
              <GluuInputRow
                name="samlACR"
                label="fields.saml_acr"
                value={formik.values.samlACR}
                formik={formik}
                lsize={12}
                rsize={12}
                disabled={isSimplePassword}
                showError={!!(formik.errors.samlACR && formik.touched.samlACR)}
                errorMessage={formik.errors.samlACR}
              />
            </div>
          )}

          {showSamlAndDescription && (
            <div className={classes.fieldItem}>
              <GluuInputRow
                name="description"
                label="fields.description"
                value={formik.values.description}
                formik={formik}
                lsize={12}
                rsize={12}
                disabled={isSimplePassword}
                showError={!!(formik.errors.description && formik.touched.description)}
                errorMessage={formik.errors.description}
              />
            </div>
          )}

          {isSimplePassword && (
            <div className={classes.fieldItem}>
              <GluuInputRow
                name="primaryKey"
                label="fields.primary_key"
                value={formik.values.primaryKey}
                formik={formik}
                lsize={12}
                rsize={12}
                disabled={true}
              />
            </div>
          )}

          {isSimplePassword && (
            <div className={classes.fieldItem}>
              <GluuInputRow
                name="passwordAttribute"
                label="fields.password_attribute"
                value={formik.values.passwordAttribute}
                formik={formik}
                lsize={12}
                rsize={12}
                disabled={true}
              />
            </div>
          )}

          {isSimplePassword && (
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="hashAlgorithm"
                label="fields.hash_algorithm"
                value={formik.values.hashAlgorithm}
                formik={formik}
                lsize={12}
                rsize={12}
                values={HASH_ALGORITHM_OPTIONS}
                disabled={true}
              />
            </div>
          )}

          {isLdap && (
            <>
              <div className={classes.fieldItem}>
                <GluuInputRow
                  name="bindDN"
                  label="fields.bind_dn"
                  value={formik.values.bindDN}
                  formik={formik}
                  lsize={12}
                  rsize={12}
                  showError={!!(formik.errors.bindDN && formik.touched.bindDN)}
                  errorMessage={formik.errors.bindDN}
                />
              </div>

              <div className={classes.fieldItem}>
                <GluuInputRow
                  name="maxConnections"
                  label="fields.max_connections"
                  value={formik.values.maxConnections}
                  formik={formik}
                  lsize={12}
                  rsize={12}
                  type="number"
                  showError={!!(formik.errors.maxConnections && formik.touched.maxConnections)}
                  errorMessage={formik.errors.maxConnections}
                />
              </div>

              <div className={classes.fieldItem}>
                <GluuInputRow
                  name="remotePrimaryKey"
                  label="fields.remote_primary_key"
                  value={formik.values.remotePrimaryKey}
                  formik={formik}
                  lsize={12}
                  rsize={12}
                />
              </div>

              <div className={classes.fieldItem}>
                <GluuInputRow
                  name="localPrimaryKey"
                  label="fields.local_primary_key"
                  value={formik.values.localPrimaryKey}
                  formik={formik}
                  lsize={12}
                  rsize={12}
                />
              </div>

              <div className={classes.fieldItem}>
                <GluuInputRow
                  name="bindPassword"
                  label="fields.bind_password"
                  value={formik.values.bindPassword}
                  formik={formik}
                  lsize={12}
                  rsize={12}
                  type="password"
                />
              </div>

              <div className={`${classes.fieldItem} ${classes.fieldItemFullWidth}`}>
                <GluuTypeAhead
                  name="servers"
                  label="fields.remote_ldap_server_post"
                  formik={formik}
                  required={true}
                  lsize={12}
                  rsize={12}
                  options={[]}
                  value={Array.isArray(formik.values.servers) ? formik.values.servers : []}
                  showError={!!(formik.errors.servers && formik.touched.servers)}
                  errorMessage={
                    typeof formik.errors.servers === 'string' ? formik.errors.servers : undefined
                  }
                />
              </div>

              <div className={`${classes.fieldItem} ${classes.fieldItemFullWidth}`}>
                <GluuTypeAhead
                  name="baseDNs"
                  label="fields.base_dns"
                  formik={formik}
                  lsize={12}
                  rsize={12}
                  options={[]}
                  value={Array.isArray(formik.values.baseDNs) ? formik.values.baseDNs : []}
                  showError={!!(formik.errors.baseDNs && formik.touched.baseDNs)}
                  errorMessage={
                    typeof formik.errors.baseDNs === 'string' ? formik.errors.baseDNs : undefined
                  }
                />
              </div>

              <div className={classes.toggleRow}>
                <GluuToogleRow
                  name="useSSL"
                  label="fields.use_ssl"
                  formik={formik}
                  lsize={12}
                  rsize={12}
                  value={formik.values.useSSL}
                />
              </div>

              <div className={classes.toggleRow}>
                <GluuToogleRow
                  name="enabled"
                  label="fields.enabled"
                  formik={formik}
                  lsize={12}
                  rsize={12}
                  value={formik.values.enabled}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {isScript && (
        <div
          className={`${classes.propsBox} ${!configurationProperties.length ? classes.propsBoxEmpty : ''}`}
        >
          <div
            className={`${classes.propsHeader} ${!configurationProperties.length ? classes.propsHeaderEmpty : ''}`}
          >
            <GluuText variant="h5" disableThemeColor>
              <span className={classes.propsTitle}>{t('fields.script_properties')}</span>
            </GluuText>
            <GluuButton
              type="button"
              backgroundColor={themeColors.settings.addPropertyButton.bg}
              textColor={themeColors.settings.addPropertyButton.text}
              useOpacityOnHover
              className={classes.propsActionBtn}
              onClick={addConfigProperty}
              disabled={!canAddProperty}
            >
              <i className="fa fa-fw fa-plus" />
              {t('actions.add_property')}
            </GluuButton>
          </div>
          <div className={classes.propsBody}>
            {configurationProperties.map((prop) => (
              <div key={prop.id} className={classes.propsRow}>
                <Input
                  value={prop.key || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeConfigProperty(prop.id, 'key', e.target.value)
                  }
                  placeholder={t('placeholders.enter_property_key')}
                  className={classes.propsInput}
                />
                <Input
                  value={prop.value || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    changeConfigProperty(prop.id, 'value', e.target.value)
                  }
                  placeholder={t('placeholders.enter_property_value')}
                  className={classes.propsInput}
                />
                <GluuButton
                  type="button"
                  backgroundColor={themeColors.settings.removeButton.bg}
                  textColor={themeColors.settings.removeButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={() => removeConfigProperty(prop.id)}
                >
                  <i className="fa fa-fw fa-trash" />
                  {t('actions.remove')}
                </GluuButton>
              </div>
            ))}
          </div>
        </div>
      )}

      <GluuThemeFormFooter
        hideDivider
        showBack={true}
        onBack={handleNavigateBack}
        showCancel={true}
        onCancel={handleCancel}
        disableCancel={isSubmitting || !formik.dirty}
        showApply={true}
        onApply={handleApply}
        disableApply={isSubmitting || !formik.dirty || !formik.isValid}
        applyButtonType="button"
        isLoading={isSubmitting}
      />
    </Form>
  )
}

export default AcrsForm
