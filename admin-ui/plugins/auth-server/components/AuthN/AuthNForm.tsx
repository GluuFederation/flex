import React, { useState, useCallback, useMemo, type ReactElement, type FormEvent } from 'react'
import { useFormik, type FormikProps } from 'formik'
import { Container, Col, InputGroup, CustomInput, Form, FormGroup, Input, Row } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { useTranslation } from 'react-i18next'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import customColors from '@/customColors'
import { useGetAcrs } from 'JansConfigApi'
import { type AuthNItem } from './atoms'
import { getAuthNValidationSchema } from './helper/validations'

export interface AuthNFormValues {
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
    key?: string
    value?: string
    value1?: string
    value2?: string
  }>
}

interface AuthNFormProps {
  item: AuthNItem
  handleSubmit: (values: AuthNFormValues) => void
  isSubmitting?: boolean
}

interface PropertyConfig {
  key: string
  value: string
}

const AuthNForm = ({ item, handleSubmit, isSubmitting = false }: AuthNFormProps): ReactElement => {
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const [modal, setModal] = useState(false)

  // Fetch ACR config using Orval hook
  const { data: acrs } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  const initialValues: AuthNFormValues = useMemo(
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
      remotePrimaryKey: item?.localPrimaryKey || '',
      localPrimaryKey: item?.localPrimaryKey || '',
      servers: Array.isArray(item?.servers) ? item.servers : item?.servers ? [item.servers] : [],
      baseDNs: Array.isArray(item?.baseDNs) ? item.baseDNs : item?.baseDNs ? [item.baseDNs] : [],
      bindPassword: item?.bindPassword || '',
      useSSL: item?.useSSL || false,
      enabled: item?.enabled || false,
      configId: item?.configId || '',
      baseDn: item?.baseDn,
      inum: item?.inum,
      configurationProperties: item?.configurationProperties || [],
    }),
    [item, acrs?.defaultAcr],
  )

  const validationSchema = useMemo(() => getAuthNValidationSchema(item), [item])

  const formik: FormikProps<AuthNFormValues> = useFormik<AuthNFormValues>({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      toggle()
    },
  })

  const toggle = useCallback((): void => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    (_userMessage: string): void => {
      toggle()
      handleSubmit(formik.values)
    },
    [toggle, handleSubmit, formik.values],
  )

  const handleApply = useCallback((): void => {
    if (isSubmitting || !formik.dirty || !formik.isValid) {
      return
    }
    toggle()
  }, [isSubmitting, formik.dirty, formik.isValid, toggle])

  const handleNavigateBack = useCallback((): void => {
    navigateBack(ROUTES.AUTH_SERVER_AUTHN)
  }, [navigateBack])

  const handleCancel = useCallback((): void => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const getPropertiesConfig = (entry: AuthNItem): PropertyConfig[] => {
    if (entry.configurationProperties && Array.isArray(entry.configurationProperties)) {
      return entry.configurationProperties.map((e) => ({
        key: e.value1 || '',
        value: e.value2 || '',
      }))
    } else {
      return []
    }
  }

  return (
    <Container fluid className="p-0">
      <Form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormGroup row>
          <Col sm={12}>
            <GluuInputRow
              name="acr"
              label="fields.acr"
              value={formik.values.acr || ''}
              formik={formik}
              lsize={4}
              rsize={8}
              disabled={true}
              showError={!!(formik.errors.acr && formik.touched.acr)}
              errorMessage={formik.errors.acr}
              required={true}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col sm={12}>
            <GluuInputRow
              name="level"
              label="fields.level"
              value={formik.values.level || ''}
              formik={formik}
              lsize={4}
              rsize={8}
              type="number"
              disabled={item.name === 'simple_password_auth'}
              showError={!!(formik.errors.level && formik.touched.level)}
              errorMessage={formik.errors.level}
              required={true}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel label="fields.default_authn_method" size={4} />
          <Col sm={8}>
            <InputGroup>
              <CustomInput
                type="select"
                id="defaultAuthNMethod"
                name="defaultAuthNMethod"
                value={String(formik.values.defaultAuthNMethod)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={false}
              >
                <option value="">{t('actions.choose')}...</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </CustomInput>
            </InputGroup>
            {formik.errors.defaultAuthNMethod && formik.touched.defaultAuthNMethod && (
              <div style={{ color: customColors.accentRed, fontSize: '12px', marginTop: '4px' }}>
                {formik.errors.defaultAuthNMethod}
              </div>
            )}
          </Col>
        </FormGroup>

        {(item.name === 'simple_password_auth' || item.name === 'myAuthnScript') && (
          <FormGroup row>
            <GluuLabel label="fields.saml_acr" size={4} />
            <Col sm={8}>
              <Input
                id="samlACR"
                name="samlACR"
                value={formik.values.samlACR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={item.name === 'simple_password_auth'}
              />
              {formik.errors.samlACR && formik.touched.samlACR && (
                <div style={{ color: customColors.accentRed, fontSize: '12px', marginTop: '4px' }}>
                  {formik.errors.samlACR}
                </div>
              )}
            </Col>
          </FormGroup>
        )}

        {(item.name === 'simple_password_auth' || item.name === 'myAuthnScript') && (
          <FormGroup row>
            <GluuLabel label="fields.description" size={4} />
            <Col sm={8}>
              <Input
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={item.name === 'simple_password_auth'}
              />
              {formik.errors.description && formik.touched.description && (
                <div style={{ color: customColors.accentRed, fontSize: '12px', marginTop: '4px' }}>
                  {formik.errors.description}
                </div>
              )}
            </Col>
          </FormGroup>
        )}

        {item.name === 'simple_password_auth' && (
          <FormGroup row>
            <GluuLabel label="fields.primary_key" size={4} />
            <Col sm={8}>
              <Input
                id="primaryKey"
                name="primaryKey"
                value={item?.primaryKey || ''}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth'}
              />
            </Col>
          </FormGroup>
        )}
        {item.name === 'simple_password_auth' && (
          <FormGroup row>
            <GluuLabel label="fields.password_attribute" size={4} />
            <Col sm={8}>
              <Input
                id="passwordAttribute"
                name="passwordAttribute"
                value={formik.values.passwordAttribute}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth'}
              />
            </Col>
          </FormGroup>
        )}

        {item.name === 'myAuthnScript' && (
          <Row>
            <GluuLabel label="fields.script_properties" size={4} />
            <Col sm={8}>
              <GluuProperties
                compName="configurationProperties"
                label="fields.custom_properties"
                formik={formik}
                keyPlaceholder={t('placeholders.enter_property_key')}
                valuePlaceholder={t('placeholders.enter_property_value')}
                options={getPropertiesConfig(item)}
                defaultValue={item.passwordAttribute}
              ></GluuProperties>
            </Col>
          </Row>
        )}

        {item.name === 'simple_password_auth' && (
          <FormGroup row>
            <GluuLabel label="fields.hash_algorithm" size={4} />
            <Col sm={8}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="hashAlgorithm"
                  name="hashAlgorithm"
                  value={formik.values.hashAlgorithm}
                  onChange={formik.handleChange}
                  disabled={item.name === 'simple_password_auth'}
                >
                  <option value="">{t('actions.choose')}...</option>
                  <option value="bcrypt">bcrypt</option>
                </CustomInput>
              </InputGroup>
            </Col>
          </FormGroup>
        )}

        {item.name === 'default_ldap_password' && (
          <>
            <FormGroup row>
              <GluuLabel label="fields.bind_dn" size={4} />
              <Col sm={8}>
                <Input
                  id="bindDN"
                  name="bindDN"
                  value={formik.values.bindDN}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.bindDN && formik.touched.bindDN && (
                  <div
                    style={{ color: customColors.accentRed, fontSize: '12px', marginTop: '4px' }}
                  >
                    {formik.errors.bindDN}
                  </div>
                )}
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.max_connections" size={4} />
              <Col sm={8}>
                <Input
                  id="maxConnections"
                  name="maxConnections"
                  type="number"
                  value={formik.values.maxConnections}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.maxConnections && formik.touched.maxConnections && (
                  <div
                    style={{ color: customColors.accentRed, fontSize: '12px', marginTop: '4px' }}
                  >
                    {formik.errors.maxConnections}
                  </div>
                )}
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.remote_primary_key" size={4} />
              <Col sm={8}>
                <Input
                  id="remotePrimaryKey"
                  name="remotePrimaryKey"
                  value={formik.values.remotePrimaryKey}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.local_primary_key" size={4} />
              <Col sm={8}>
                <Input
                  id="localPrimaryKey"
                  name="localPrimaryKey"
                  value={formik.values.localPrimaryKey}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
            </FormGroup>

            <GluuTypeAhead
              name="servers"
              label="fields.remote_ldap_server_post"
              formik={formik}
              required={true}
              options={[]}
              value={Array.isArray(formik.values.servers) ? formik.values.servers : []}
              showError={!!(formik.errors.servers && formik.touched.servers)}
              errorMessage={formik.errors.servers as string}
            />

            {formik.errors.servers && formik.touched.servers ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.servers}</div>
            ) : null}

            <GluuTypeAhead
              name="baseDNs"
              label="fields.base_dns"
              formik={formik}
              options={[]}
              value={Array.isArray(formik.values.baseDNs) ? formik.values.baseDNs : []}
              showError={!!(formik.errors.baseDNs && formik.touched.baseDNs)}
              errorMessage={formik.errors.baseDNs as string}
            />

            <FormGroup row>
              <GluuLabel label="fields.bind_password" size={4} />
              <Col sm={8}>
                <Input
                  id="bindPassword"
                  name="bindPassword"
                  type="password"
                  value={formik.values.bindPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.use_ssl" doc_entry="use_ssl" />
              <Col sm={9}>
                <InputGroup>
                  <Input
                    placeholder={t('placeholders.use_ssl')}
                    id="useSSL"
                    type="checkbox"
                    checked={formik.values.useSSL}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.enabled" doc_entry="enabled" />
              <Col sm={9}>
                <InputGroup>
                  <Input
                    placeholder={t('placeholders.enabled')}
                    id="enabled"
                    type="checkbox"
                    checked={formik.values.enabled}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
          </>
        )}
        <GluuFormFooter
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
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
      </Form>
    </Container>
  )
}

export default AuthNForm
