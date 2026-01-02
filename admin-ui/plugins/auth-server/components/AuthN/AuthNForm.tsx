import React, { useState, type ReactElement, type FormEvent } from 'react'
import { useFormik, type FormikProps } from 'formik'
import * as Yup from 'yup'
import { Container, Col, InputGroup, CustomInput, Form, FormGroup, Input, Row } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { useTranslation } from 'react-i18next'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import customColors from '@/customColors'
import { useGetAcrs } from 'JansConfigApi'

interface ConfigurationProperty {
  key?: string
  value?: string
  value1?: string
  value2?: string
  hide?: boolean
}

interface AuthNItem {
  inum?: string
  name?: string
  acrName?: string
  level?: number
  samlACR?: string
  description?: string
  primaryKey?: string
  passwordAttribute?: string
  hashAlgorithm?: string
  bindDN?: string
  maxConnections?: number
  localPrimaryKey?: string
  servers?: string[]
  baseDNs?: string[]
  bindPassword?: string
  useSSL?: boolean
  enabled?: boolean
  configId?: string
  baseDn?: string
  dn?: string
  configurationProperties?: ConfigurationProperty[]
  tableData?: unknown
}

interface AuthNFormValues {
  acr: string
  level: number
  defaultAuthNMethod: boolean
  samlACR: string
  description: string
  primaryKey: string
  passwordAttribute: string
  hashAlgorithm: string
  bindDN: string
  maxConnections: string | number
  remotePrimaryKey: string
  localPrimaryKey: string
  servers: string | string[]
  baseDNs: string | string[]
  bindPassword: string
  useSSL: boolean
  enabled: boolean
  configId: string
  baseDn: string | undefined
  inum: string | undefined
}

interface AuthNFormProps {
  item: AuthNItem
  handleSubmit: (values: AuthNFormValues) => void
}

interface PropertyConfig {
  key: string
  value: string
}

function AuthNForm({ item, handleSubmit }: AuthNFormProps): ReactElement {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)

  // Fetch ACR config using Orval hook
  const { data: acrs } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  const initialValues: AuthNFormValues = {
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
    servers: item?.servers || '',
    baseDNs: item?.baseDNs || '',
    bindPassword: item?.bindPassword || '',
    useSSL: item?.useSSL || false,
    enabled: item?.enabled || false,
    configId: item?.configId || '',
    baseDn: item?.baseDn,
    inum: item?.inum,
  }

  const formik: FormikProps<AuthNFormValues> = useFormik<AuthNFormValues>({
    initialValues: initialValues,
    onSubmit: () => {
      toggle()
    },
    validationSchema: Yup.object({
      acr: Yup.string().required('ACR name is required.'),
      level: Yup.string().required('Level is required.'),
    }),
  })

  const toggle = (): void => {
    setModal(!modal)
  }

  const submitForm = (): void => {
    toggle()
    handleSubmit(formik.values)
  }

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
    <Container>
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
          <Col sm={4}>
            <InputGroup>
              <CustomInput
                type="select"
                id="defaultAuthNMethod"
                name="defaultAuthNMethod"
                value={String(formik.values.defaultAuthNMethod)}
                onChange={formik.handleChange}
                disabled={false}
              >
                <option value="">{t('actions.choose')}...</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>

        {(item.name === 'simple_password_auth' || item.name === 'myAuthnScript') && (
          <FormGroup row>
            <GluuLabel label="fields.saml_acr" size={4} />
            <Col sm={8}>
              <Input
                id="samlACR"
                name="samlACR"
                defaultValue={formik.values.samlACR}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth'}
              />
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
                defaultValue={formik.values.description}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth'}
              />
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
            <Col sm={4}>
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
                  value={item?.bindDN || ''}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.max_connections" size={4} />
              <Col sm={8}>
                <Input
                  id="maxConnections"
                  name="maxConnections"
                  value={item?.maxConnections || ''}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.remote_primary_key" size={4} />
              <Col sm={8}>
                <Input
                  id="remotePrimaryKey"
                  name="remotePrimaryKey"
                  value={item?.localPrimaryKey || ''}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.local_primary_key" size={4} />
              <Col sm={8}>
                <Input
                  id="localPrimaryKey"
                  name="localPrimaryKey"
                  value={item?.localPrimaryKey || ''}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <GluuTypeAhead
              name="servers"
              label="fields.remote_ldap_server_post"
              formik={formik}
              required={true}
              options={[]}
              value={item.servers || []}
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
              value={item.baseDNs || []}
              showError={!!(formik.errors.baseDNs && formik.touched.baseDNs)}
              errorMessage={formik.errors.baseDNs as string}
            />

            <FormGroup row>
              <GluuLabel label="fields.bind_password" size={4} />
              <Col sm={8}>
                <Input
                  id="bindPassword"
                  name="bindPassword"
                  value={item?.bindPassword || ''}
                  onChange={formik.handleChange}
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
                    defaultChecked={item.useSSL}
                    onChange={formik.handleChange}
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
                    defaultChecked={item.enabled}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
          </>
        )}
        <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: true }} type="submit" />
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
      </Form>
    </Container>
  )
}

export default AuthNForm
