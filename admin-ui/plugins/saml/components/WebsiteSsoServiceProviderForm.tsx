import React, { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  createWebsiteSsoServiceProvider,
  toggleSavedFormFlag,
  updateWebsiteSsoServiceProvider,
} from 'Plugins/saml/redux/features/SamlSlice'
import { useDispatch, useSelector } from 'react-redux'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { Card, CardBody, Form, FormGroup, Col, Row } from 'Components'
import { useFormik } from 'formik'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTranslation } from 'react-i18next'
import { setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import {
  nameIDPolicyFormat,
  websiteSsoServiceProviderValidationSchema,
  transformToWebsiteSsoServiceProviderFormValues,
  buildWebsiteSsoServiceProviderPayload,
} from '../helper'
import type { WebsiteSsoServiceProviderFormValues } from '../types/formValues'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import SetTitle from 'Utils/SetTitle'
import { useGetAttributes } from 'JansConfigApi'
import GluuStatusMessage from 'Routes/Apps/Gluu/GluuStatusMessage'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { WebsiteSsoServiceProvider } from '../types/redux'
import type { SamlRootState } from '../types/state'
import type { LocationState } from '../types'

const MAX_ATTRIBUTES_FOR_WEBSITE_SSO = 100

interface WebsiteSsoServiceProviderFormProps {
  configs?: WebsiteSsoServiceProvider | null
  viewOnly?: boolean
}

interface ScopeOption {
  dn: string
  name: string
}

const DOC_SECTION = 'saml' as const

const WebsiteSsoServiceProviderForm = ({
  configs: propsConfigs,
  viewOnly: propsViewOnly,
}: WebsiteSsoServiceProviderFormProps = {}) => {
  const location = useLocation()
  const state = location.state as LocationState<WebsiteSsoServiceProvider> | null

  const configs = useMemo(
    () => propsConfigs ?? state?.rowData ?? null,
    [propsConfigs, state?.rowData],
  )
  const viewOnly = useMemo(
    () => propsViewOnly ?? state?.viewOnly ?? false,
    [propsViewOnly, state?.viewOnly],
  )
  const { t } = useTranslation()

  const title = useMemo(() => {
    if (viewOnly) {
      return t('titles.view_service_provider')
    } else if (configs) {
      return t('titles.edit_service_provider')
    } else {
      return t('titles.create_service_provider')
    }
  }, [viewOnly, configs, t])

  SetTitle(title)

  const loading = useSelector((state: SamlRootState) => state.idpSamlReducer.loading)
  const savedForm = useSelector((state: SamlRootState) => state.idpSamlReducer.savedForm)
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const [modal, setModal] = useState<boolean>(false)

  const {
    data: attributesData,
    error: attributesError,
    isLoading: attributesLoading,
  } = useGetAttributes({ limit: MAX_ATTRIBUTES_FOR_WEBSITE_SSO })

  const attributesList = useMemo<ScopeOption[]>(
    () =>
      attributesData?.entries
        ? attributesData.entries.map(
            (item): ScopeOption => ({
              dn: String(item?.dn || ''),
              name: String(item?.displayName || ''),
            }),
          )
        : [],
    [attributesData],
  )

  const defaultScopeValue = useMemo<ScopeOption[]>(
    () =>
      configs?.releasedAttributes?.length
        ? attributesList.filter((item) => configs?.releasedAttributes?.includes(item.dn))
        : [],
    [configs?.releasedAttributes, attributesList],
  )

  const selectedClientScopes = useSelector(
    (state: { scopeReducer: { selectedClientScopes: ScopeOption[] } }) =>
      state.scopeReducer.selectedClientScopes,
  )

  const validationSchema = useMemo(() => websiteSsoServiceProviderValidationSchema(t), [t])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const initialValues = useMemo<WebsiteSsoServiceProviderFormValues>(
    () => transformToWebsiteSsoServiceProviderFormValues(configs),
    [configs],
  )

  const formik = useFormik<WebsiteSsoServiceProviderFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      toggle()
    },
  })

  const scopeFieldValue = useMemo<ScopeOption[]>(() => {
    const formikValue = formik.values.releasedAttributes

    if (Array.isArray(formikValue)) {
      if (formikValue.length === 0) return []
      return attributesList.filter((item) => formikValue.includes(item.dn))
    }

    if (selectedClientScopes?.length) return selectedClientScopes
    return defaultScopeValue
  }, [formik.values.releasedAttributes, selectedClientScopes, defaultScopeValue, attributesList])

  const releasedAttributesKey = useMemo(() => {
    if (configs?.inum) {
      return `releasedAttributes-${configs.inum}`
    }
    return 'releasedAttributes-new'
  }, [configs?.inum])

  const handleSubmit = useCallback(
    (values: WebsiteSsoServiceProviderFormValues, user_message: string) => {
      const { metaDataFileImportedFlag, metaDataFile, ...websiteSsoServiceProviderData } = values
      void metaDataFileImportedFlag
      const formdata = new FormData()

      if (metaDataFile) {
        formdata.append('metaDataFile', metaDataFile)
      }

      const payload = buildWebsiteSsoServiceProviderPayload(
        websiteSsoServiceProviderData,
        configs?.inum,
      )

      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })

      formdata.append('trustRelationship', blob)

      if (!configs) {
        dispatch(
          createWebsiteSsoServiceProvider({
            action: { action_message: user_message, action_data: formdata },
          }),
        )
      } else {
        dispatch(
          updateWebsiteSsoServiceProvider({
            action: {
              action_message: user_message,
              action_data: formdata,
              action_inum: configs.inum,
            },
          }),
        )
      }
    },
    [configs, dispatch],
  )

  const submitForm = useCallback(
    (messages: string) => {
      toggle()
      handleSubmit(formik.values, messages)
    },
    [toggle, handleSubmit, formik],
  )

  const saveSelectedScopes = useCallback(
    (scopes: ScopeOption[]) => {
      dispatch(setClientSelectedScopes(scopes))
    },
    [dispatch],
  )

  useEffect(() => {
    if (savedForm) {
      navigateBack(ROUTES.SAML_SP_LIST)
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
      dispatch(setClientSelectedScopes([]))
    }
  }, [savedForm, navigateBack, dispatch])

  const handleDrop = useCallback(
    (files: File[]) => {
      if (viewOnly) return
      const file = files[0]
      if (file) {
        formik.setValues({
          ...formik.values,
          metaDataFileImportedFlag: true,
          metaDataFile: file,
        })
        formik.setFieldTouched('metaDataFile', false, false)
      }
    },
    [formik, viewOnly],
  )

  const handleClearFiles = useCallback(() => {
    if (viewOnly) return
    formik.setValues({
      ...formik.values,
      metaDataFileImportedFlag: false,
      metaDataFile: null,
    })
    formik.setFieldTouched('metaDataFile', true)
  }, [formik, viewOnly])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (formik.values.spMetaDataSourceType?.toLowerCase() === 'file') {
        const hasMetadata =
          formik.values.metaDataFile ||
          formik.values.metaDataFileImportedFlag ||
          formik.values.spMetaDataFN
        if (!hasMetadata) {
          formik.setFieldTouched('metaDataFile', true)
          return
        }
      }

      const errors = await formik.validateForm()
      if (Object.keys(errors).length > 0) {
        const touched: Record<string, boolean | Record<string, boolean>> = {}
        Object.keys(errors).forEach((key) => {
          if (key.includes('.')) {
            const [parent, child] = key.split('.')
            if (!touched[parent] || typeof touched[parent] === 'boolean') {
              touched[parent] = {}
            }
            if (typeof touched[parent] === 'object' && !Array.isArray(touched[parent])) {
              ;(touched[parent] as Record<string, boolean>)[child] = true
            }
          } else {
            touched[key] = true
          }
        })
        formik.setTouched(touched, false)
        return
      }

      formik.handleSubmit(e)
    },
    [formik],
  )

  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody>
          <Form onSubmit={handleFormSubmit} className="mt-4">
            <FormGroup row>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.name"
                  name="name"
                  value={formik.values.name || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={Boolean(
                    formik.errors.name &&
                    (formik.touched.name ||
                      formik.submitCount > 0 ||
                      (formik.values.name && formik.values.name.length > 0)),
                  )}
                  errorMessage={formik.errors.name}
                  disabled={viewOnly}
                  required
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.displayName"
                  name="displayName"
                  value={formik.values.displayName || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={Boolean(
                    formik.errors.displayName &&
                    (formik.touched.displayName ||
                      formik.submitCount > 0 ||
                      (formik.values.displayName && formik.values.displayName.length > 0)),
                  )}
                  errorMessage={formik.errors.displayName}
                  disabled={viewOnly}
                  required
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.description"
                  name="description"
                  value={formik.values.description || ''}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  disabled={viewOnly}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuToggleRow
                  label={'fields.enable_tr'}
                  name="enabled"
                  viewOnly={viewOnly}
                  formik={formik}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuInputRow
                  label="fields.service_provider_logout_url"
                  name="spLogoutURL"
                  value={formik.values.spLogoutURL}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  showError={Boolean(
                    formik.errors.spLogoutURL &&
                    (formik.touched.spLogoutURL ||
                      formik.submitCount > 0 ||
                      (formik.values.spLogoutURL && formik.values.spLogoutURL.length > 0)),
                  )}
                  errorMessage={formik.errors.spLogoutURL}
                  disabled={viewOnly}
                  doc_category={DOC_SECTION}
                />
              </Col>
              <Col sm={10}>
                <GluuTypeAheadForDn
                  key={releasedAttributesKey}
                  name="releasedAttributes"
                  label="fields.released_attributes"
                  formik={formik}
                  value={scopeFieldValue}
                  options={attributesList}
                  lsize={4}
                  rsize={8}
                  disabled={viewOnly || attributesLoading}
                  isLoading={attributesLoading}
                  placeholder={attributesLoading ? `${t('messages.loading_attributes')}...` : ''}
                  onChange={saveSelectedScopes}
                  paginate={false}
                  hideHelperMessage={true}
                  defaultSelected={scopeFieldValue}
                  doc_category={DOC_SECTION}
                />
                {attributesError ? (
                  <GluuStatusMessage
                    message={t('errors.attribute_load_failed')}
                    type="error"
                    labelSize={4}
                    colSize={8}
                  />
                ) : null}
              </Col>
              <Col sm={10}>
                <GluuSelectRow
                  label="fields.metadata_location"
                  formik={formik}
                  value={formik.values.spMetaDataSourceType}
                  values={[
                    { value: 'file', label: 'File' },
                    { value: 'manual', label: 'Manual' },
                  ]}
                  lsize={4}
                  rsize={8}
                  name="spMetaDataSourceType"
                  disabled={viewOnly}
                  showError={Boolean(
                    formik.errors.spMetaDataSourceType && formik.touched.spMetaDataSourceType,
                  )}
                  errorMessage={formik.errors.spMetaDataSourceType}
                  required
                  doc_category={DOC_SECTION}
                />
              </Col>
              {formik.values.spMetaDataSourceType?.toLowerCase() === 'file' && (
                <Col sm={10}>
                  <FormGroup row>
                    <GluuLabel label={'fields.import_metadata_from_file'} size={4} required />
                    <Col sm={8}>
                      <GluuUploadFile
                        key={`metadata-file-${formik.values.metaDataFile?.name || configs?.spMetaDataFN || 'empty'}-${formik.values.metaDataFileImportedFlag}`}
                        accept={{
                          'text/xml': ['.xml'],
                          'application/json': ['.json'],
                        }}
                        fileName={
                          formik.values.metaDataFile?.name ||
                          (formik.values.metaDataFileImportedFlag && configs?.spMetaDataFN
                            ? configs.spMetaDataFN
                            : null)
                        }
                        placeholder={`Drag 'n' drop .xml/.json file here, or click to select file`}
                        onDrop={handleDrop}
                        onClearFiles={handleClearFiles}
                        disabled={viewOnly}
                        showClearButton={!viewOnly}
                      />
                      {formik.errors.metaDataFile && formik.touched.metaDataFile && (
                        <GluuStatusMessage
                          message={
                            (formik.errors.metaDataFile as string) ||
                            t('messages.import_metadata_file')
                          }
                          type="error"
                          inline
                        />
                      )}
                    </Col>
                  </FormGroup>
                </Col>
              )}
              {formik.values.spMetaDataSourceType?.toLowerCase() === 'manual' && (
                <>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.single_logout_service_url"
                      name="samlMetadata.singleLogoutServiceUrl"
                      value={formik.values.samlMetadata.singleLogoutServiceUrl}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={Boolean(
                        formik.errors.samlMetadata?.singleLogoutServiceUrl &&
                        (formik.touched.samlMetadata?.singleLogoutServiceUrl ||
                          formik.submitCount > 0 ||
                          (formik.values.samlMetadata.singleLogoutServiceUrl &&
                            formik.values.samlMetadata.singleLogoutServiceUrl.length > 0)),
                      )}
                      errorMessage={formik.errors.samlMetadata?.singleLogoutServiceUrl}
                      disabled={viewOnly}
                      required={Boolean(
                        formik.values.spMetaDataSourceType?.toLowerCase() === 'manual',
                      )}
                      doc_category={DOC_SECTION}
                      doc_entry="singleLogoutServiceUrl"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.entity_id"
                      name="samlMetadata.entityId"
                      value={formik.values.samlMetadata.entityId}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={Boolean(
                        formik.errors.samlMetadata?.entityId &&
                        (formik.touched.samlMetadata?.entityId ||
                          formik.submitCount > 0 ||
                          (formik.values.samlMetadata.entityId &&
                            formik.values.samlMetadata.entityId.length > 0)),
                      )}
                      errorMessage={formik.errors.samlMetadata?.entityId}
                      disabled={viewOnly}
                      required={Boolean(
                        formik.values.spMetaDataSourceType?.toLowerCase() === 'manual',
                      )}
                      doc_category={DOC_SECTION}
                      doc_entry="entityId"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuSelectRow
                      label="fields.name_id_policy_format"
                      name="samlMetadata.nameIDPolicyFormat"
                      value={formik.values.samlMetadata.nameIDPolicyFormat}
                      values={nameIDPolicyFormat}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={Boolean(
                        formik.errors.samlMetadata?.nameIDPolicyFormat &&
                        (formik.touched.samlMetadata?.nameIDPolicyFormat || formik.submitCount > 0),
                      )}
                      errorMessage={formik.errors.samlMetadata?.nameIDPolicyFormat}
                      disabled={viewOnly}
                      required={Boolean(
                        formik.values.spMetaDataSourceType?.toLowerCase() === 'manual',
                      )}
                      doc_category={DOC_SECTION}
                      doc_entry="nameIDPolicyFormat"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.jans_assertion_consumer_service_get_url"
                      name="samlMetadata.jansAssertionConsumerServiceGetURL"
                      value={formik.values.samlMetadata.jansAssertionConsumerServiceGetURL}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={Boolean(
                        formik.errors.samlMetadata?.jansAssertionConsumerServiceGetURL &&
                        (formik.touched.samlMetadata?.jansAssertionConsumerServiceGetURL ||
                          formik.submitCount > 0 ||
                          (formik.values.samlMetadata.jansAssertionConsumerServiceGetURL &&
                            formik.values.samlMetadata.jansAssertionConsumerServiceGetURL.length >
                              0)),
                      )}
                      errorMessage={formik.errors.samlMetadata?.jansAssertionConsumerServiceGetURL}
                      disabled={viewOnly}
                      required={Boolean(
                        formik.values.spMetaDataSourceType?.toLowerCase() === 'manual',
                      )}
                      doc_category={DOC_SECTION}
                      doc_entry="jansAssertionConsumerServicePostURL"
                    />
                  </Col>
                  <Col sm={10}>
                    <GluuInputRow
                      label="fields.jans_assertion_consumer_service_post_url"
                      name="samlMetadata.jansAssertionConsumerServicePostURL"
                      value={formik.values.samlMetadata.jansAssertionConsumerServicePostURL}
                      formik={formik}
                      lsize={4}
                      rsize={8}
                      showError={Boolean(
                        formik.errors.samlMetadata?.jansAssertionConsumerServicePostURL &&
                        (formik.touched.samlMetadata?.jansAssertionConsumerServicePostURL ||
                          formik.submitCount > 0 ||
                          (formik.values.samlMetadata.jansAssertionConsumerServicePostURL &&
                            formik.values.samlMetadata.jansAssertionConsumerServicePostURL.length >
                              0)),
                      )}
                      errorMessage={formik.errors.samlMetadata?.jansAssertionConsumerServicePostURL}
                      disabled={viewOnly}
                      required={Boolean(
                        formik.values.spMetaDataSourceType?.toLowerCase() === 'manual',
                      )}
                      doc_category={DOC_SECTION}
                      doc_entry="jansAssertionConsumerServicePostURL"
                    />
                  </Col>
                </>
              )}
            </FormGroup>
            <Row>
              <Col>
                <GluuFormFooter
                  showBack={true}
                  showCancel={!viewOnly}
                  showApply={!viewOnly}
                  onBack={() => navigateBack(ROUTES.SAML_SP_LIST)}
                  onApply={toggle}
                  onCancel={handleCancel}
                  disableBack={false}
                  disableCancel={!formik.dirty}
                  disableApply={!formik.isValid || !formik.dirty}
                  applyButtonType="button"
                />
              </Col>
            </Row>
            <GluuCommitDialog
              handler={toggle}
              modal={modal}
              onAccept={submitForm}
              formik={formik}
            />
          </Form>
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

WebsiteSsoServiceProviderForm.displayName = 'WebsiteSsoServiceProviderForm'

export default memo(WebsiteSsoServiceProviderForm)
