import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormGroup, Input, GluuDynamicList } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import { useTranslation } from 'react-i18next'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { getClientScopeByInum } from '../../../../../app/utils/Util'
import { useDebounce } from '@/utils/hooks/useDebounce'
import { useGetOauthScopes } from 'JansConfigApi'
import {
  CLIENT_BASIC_MODIFIED_FIELDS,
  CLIENT_DYNAMIC_LIST_I18N,
  DOC_CATEGORY,
  FETCH_LIMITS,
  GRANT_TYPE_OPTIONS,
  RESPONSE_TYPE_OPTIONS,
  APPLICATION_TYPE_OPTIONS,
  SUBJECT_TYPE_OPTIONS,
  CLIENT_BASIC_SECTION_GROUPS,
} from '../constants'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import {
  appendDynamicListItem,
  getClientSectionFields,
  getDynamicListValidationMessage,
  mapDynamicListValues,
  uriValidator,
} from 'Plugins/auth-server/utils'
import { useStyles } from './styles/ClientBasicPanel.style'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { ClientBasicPanelProps } from '../types'

const ClientBasicPanel = ({
  client,
  formik,
  oidcConfiguration,
  viewOnly,
  setModifiedFields,
}: ClientBasicPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })

  const [scopeSearchQuery, setScopeSearchQuery] = useState('')
  const debouncedScopeQuery = useDebounce(scopeSearchQuery, 500)

  const clientScopeInums = useMemo(() => {
    if (!client.inum || !client.scopes?.length) return ''
    return client.scopes.map((scope) => getClientScopeByInum(scope)).join(',')
  }, [client.inum, client.scopes])

  const { data: clientScopesData, isLoading: isClientScopesLoading } = useGetOauthScopes(
    { pattern: clientScopeInums, limit: FETCH_LIMITS.SCOPES },
    { query: { enabled: !!clientScopeInums } },
  )

  const { data: searchScopesData, isLoading: isSearchLoading } = useGetOauthScopes(
    { pattern: debouncedScopeQuery.trim(), limit: FETCH_LIMITS.SCOPES },
    { query: { enabled: true } },
  )

  const scopeLoading = isClientScopesLoading || isSearchLoading

  const allScopeOptions = useMemo(() => {
    const clientEntries = (clientScopesData?.entries ?? []).map((item) => ({
      dn: item.dn as string | undefined,
      name: item.id as string | undefined,
    }))
    const searchEntries = (searchScopesData?.entries ?? []).map((item) => ({
      dn: item.dn as string | undefined,
      name: item.id as string | undefined,
    }))
    const combined = [...clientEntries, ...searchEntries]
    const seen = new Set<string>()
    return combined.filter((s) => {
      if (!s.dn) return true
      if (seen.has(s.dn)) return false
      seen.add(s.dn)
      return true
    })
  }, [clientScopesData, searchScopesData])

  const scopeNameOptions = useMemo(
    () => allScopeOptions.map((s) => s.name).filter((n): n is string => Boolean(n)),
    [allScopeOptions],
  )

  const selectedScopeNames = useMemo(() => {
    const selectedDns = (formik.values.scopes as string[] | undefined) ?? []
    return selectedDns
      .map((dn) => allScopeOptions.find((s) => s.dn === dn)?.name)
      .filter((n): n is string => Boolean(n))
  }, [formik.values.scopes, allScopeOptions])

  const tokenEndpointAuthMethod = useMemo(() => {
    const supportedMethods = oidcConfiguration?.tokenEndpointAuthMethodsSupported ?? []
    const currentValue = formik.values.tokenEndpointAuthMethod
    if (currentValue && !supportedMethods.includes(String(currentValue))) {
      return [...supportedMethods, String(currentValue)]
    }
    return supportedMethods
  }, [oidcConfiguration?.tokenEndpointAuthMethodsSupported, formik.values.tokenEndpointAuthMethod])

  const [redirectUriItems, setRedirectUriItems] = useState<GluuDynamicListItem[]>([])
  const isRedirectUriSyncingRef = useRef(false)

  const handleScopeChange = useCallback(
    (selectedNames: string[]) => {
      const dns = selectedNames
        .map((name) => allScopeOptions.find((s) => s.name === name)?.dn)
        .filter((dn): dn is string => Boolean(dn))
      formik.setFieldValue('scopes', dns)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_BASIC_MODIFIED_FIELDS.SCOPES]: selectedNames,
      }))
    },
    [allScopeOptions, formik, setModifiedFields],
  )

  const redirectUrisRegexValue = formik.values?.attributes?.redirectUrisRegex
  const redirectUrisRegexStr =
    typeof redirectUrisRegexValue === 'string' || typeof redirectUrisRegexValue === 'number'
      ? redirectUrisRegexValue
      : undefined
  const formErrors = formik.errors as Record<string, string | undefined> & {
    attributes?: Record<string, string | undefined>
  }
  const formTouched = formik.touched as Record<string, boolean | undefined> & {
    attributes?: Record<string, boolean | undefined>
  }
  const attributeErrors =
    formErrors.attributes && typeof formErrors.attributes === 'object'
      ? (formErrors.attributes as Record<string, string | undefined>)
      : {}
  const attributeTouched =
    formTouched.attributes && typeof formTouched.attributes === 'object'
      ? (formTouched.attributes as Record<string, boolean | undefined>)
      : {}
  const getFieldError = useCallback(
    (field: string) => {
      const error = formErrors[field]
      return typeof error === 'string' ? error : ''
    },
    [formErrors],
  )

  const isFieldTouched = useCallback((field: string) => Boolean(formTouched[field]), [formTouched])

  useEffect(() => {
    const nextRedirectUris = ((formik.values.redirectUris as string[] | undefined) ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setRedirectUriItems((currentItems) => {
      const currentRedirectUris = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isRedirectUriSyncingRef.current) {
        isRedirectUriSyncingRef.current = false
        if (JSON.stringify(nextRedirectUris) === JSON.stringify(currentRedirectUris)) {
          return currentItems
        }
      }

      if (JSON.stringify(nextRedirectUris) === JSON.stringify(currentRedirectUris)) {
        return currentItems
      }

      return mapDynamicListValues(nextRedirectUris)
    })
  }, [formik.values.redirectUris])

  const syncRedirectUris = useCallback(
    (items: GluuDynamicListItem[]) => {
      setRedirectUriItems(items)
      const nextRedirectUris = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isRedirectUriSyncingRef.current = true
      formik.setFieldValue('redirectUris', nextRedirectUris, true)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_BASIC_MODIFIED_FIELDS.REDIRECT_URIS]: nextRedirectUris,
      }))
    },
    [formik, setModifiedFields],
  )

  const handleAddRedirectUri = useCallback(() => {
    setRedirectUriItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeRedirectUri = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...redirectUriItems]
      nextItems[index] = { ...nextItems[index], value }
      syncRedirectUris(nextItems)
    },
    [redirectUriItems, syncRedirectUris],
  )

  const handleRemoveRedirectUri = useCallback(
    (index: number) => {
      const nextItems = redirectUriItems.filter((_, itemIndex) => itemIndex !== index)
      syncRedirectUris(nextItems)
    },
    [redirectUriItems, syncRedirectUris],
  )

  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`
  const redirectUrisError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: redirectUriItems,
        t,
        validateItem: (item) => uriValidator(item.value ?? ''),
        invalidMessage: t('validation_messages.invalid_url_format'),
      }),
    [redirectUriItems, t],
  )

  const fieldMap = {
    clientName: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.client_name"
          name="clientName"
          formik={formik}
          value={formik.values.clientName as string | undefined}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          required
          disabled={viewOnly}
          placeholder={t('placeholders.client_name')}
          showError={isFieldTouched('clientName') && Boolean(getFieldError('clientName'))}
          errorMessage={getFieldError('clientName')}
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.CLIENT_NAME]: event.target.value,
            }))
          }}
        />
      </div>
    ),
    clientSecret: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.client_secret"
          name="clientSecret"
          type="password"
          formik={formik}
          value={(formik.values.clientSecret as string) ?? ''}
          doc_category={DOC_CATEGORY}
          doc_entry="clientSecret"
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          allowPasswordToggleWhenDisabled={viewOnly}
          placeholder={getFieldPlaceholder(t, 'fields.client_secret')}
          showError={isFieldTouched('clientSecret') && Boolean(getFieldError('clientSecret'))}
          errorMessage={getFieldError('clientSecret')}
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.CLIENT_SECRET]: event.target.value,
            }))
          }}
        />
      </div>
    ),
    description: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.description"
          name="description"
          formik={formik}
          value={formik.values.description as string | undefined}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          placeholder={t('placeholders.description')}
          showError={isFieldTouched('description') && Boolean(getFieldError('description'))}
          errorMessage={getFieldError('description')}
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.DESCRIPTION]: event.target.value,
            }))
          }}
        />
      </div>
    ),
    sectorIdentifierUri: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.sector_uri"
          name="sectorIdentifierUri"
          formik={formik}
          value={formik.values.sectorIdentifierUri as string | undefined}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          placeholder={t('placeholders.sector_uri')}
          showError={
            isFieldTouched('sectorIdentifierUri') && Boolean(getFieldError('sectorIdentifierUri'))
          }
          errorMessage={getFieldError('sectorIdentifierUri')}
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.SECTOR_IDENTIFIER_URI]: event.target.value || null,
            }))
          }}
        />
      </div>
    ),
    applicationType: (
      <div className={classes.fieldItem}>
        <GluuSelectRow
          label="fields.application_type"
          name="applicationType"
          formik={formik}
          value={formik.values.applicationType as string | undefined}
          values={APPLICATION_TYPE_OPTIONS}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          doc_entry="applicationType"
          disabled={viewOnly}
          showError={isFieldTouched('applicationType') && Boolean(getFieldError('applicationType'))}
          errorMessage={getFieldError('applicationType')}
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.APPLICATION_TYPE]: event.target.value,
            }))
          }}
        />
      </div>
    ),
    subjectType: (
      <div className={classes.fieldItem}>
        <GluuSelectRow
          label="fields.subject_type_basic"
          name="subjectType"
          formik={formik}
          value={formik.values.subjectType as string | undefined}
          values={SUBJECT_TYPE_OPTIONS}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          doc_entry="subjectType"
          disabled={viewOnly}
          showError={isFieldTouched('subjectType') && Boolean(getFieldError('subjectType'))}
          errorMessage={getFieldError('subjectType')}
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.SUBJECT_TYPE]: event.target.value,
            }))
          }}
        />
      </div>
    ),
    tokenEndpointAuthMethod: (
      <div className={classes.fieldItem}>
        <GluuSelectRow
          label="fields.token_endpoint_auth_method"
          formik={formik}
          value={formik.values.tokenEndpointAuthMethod as string | undefined}
          values={tokenEndpointAuthMethod}
          lsize={12}
          rsize={12}
          name="tokenEndpointAuthMethod"
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          showError={
            isFieldTouched('tokenEndpointAuthMethod') &&
            Boolean(getFieldError('tokenEndpointAuthMethod'))
          }
          errorMessage={getFieldError('tokenEndpointAuthMethod')}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.TOKEN_ENDPOINT_AUTH_METHOD]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    responseTypes: (
      <div className={classes.fieldItem}>
        <GluuMultiSelectRow
          name="responseTypes"
          label="fields.response_types"
          formik={formik}
          value={formik.values.responseTypes as string[] | undefined}
          options={RESPONSE_TYPE_OPTIONS}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          placeholder={getFieldPlaceholder(t, 'fields.response_types')}
          showError={isFieldTouched('responseTypes') && Boolean(getFieldError('responseTypes'))}
          errorMessage={getFieldError('responseTypes')}
          helperText={isFieldTouched('responseTypes') ? t('messages.multi_select_hint') : undefined}
        />
      </div>
    ),
    grantTypes: (
      <div className={classes.fieldItem}>
        <GluuMultiSelectRow
          name="grantTypes"
          label="fields.grant_types"
          formik={formik}
          value={formik.values.grantTypes as string[] | undefined}
          options={GRANT_TYPE_OPTIONS}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          placeholder={getFieldPlaceholder(t, 'fields.grant_types')}
          showError={isFieldTouched('grantTypes') && Boolean(getFieldError('grantTypes'))}
          errorMessage={getFieldError('grantTypes')}
          helperText={isFieldTouched('grantTypes') ? t('messages.multi_select_hint') : undefined}
        />
      </div>
    ),
    isActive: (
      <div className={classes.fieldItem}>
        <GluuToogleRow
          label="fields.is_active"
          name="disabled"
          formik={null}
          value={!formik.values.disabled}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handler={(e) => {
            const isActive = e.target.checked
            formik.setFieldValue('disabled', !isActive)
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.IS_ACTIVE]: isActive,
            }))
          }}
        />
      </div>
    ),
    trustedClient: (
      <div className={classes.fieldItem}>
        <GluuToogleRow
          label="fields.is_trusted_client"
          name="trustedClient"
          formik={formik}
          value={Boolean(formik.values.trustedClient)}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handler={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.TRUST_CLIENT]: e.target.checked,
            }))
          }}
        />
      </div>
    ),
    redirectUrisRegex: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.redirectUrisRegex"
          name="attributes.redirectUrisRegex"
          formik={formik}
          value={redirectUrisRegexStr}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          placeholder={getFieldPlaceholder(t, 'fields.redirectUrisRegex')}
          showError={
            Boolean(attributeTouched.redirectUrisRegex) &&
            typeof attributeErrors.redirectUrisRegex === 'string'
          }
          errorMessage={
            typeof attributeErrors.redirectUrisRegex === 'string'
              ? attributeErrors.redirectUrisRegex
              : ''
          }
          handleChange={(event) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_BASIC_MODIFIED_FIELDS.REDIRECT_URIS_REGEX]: event.target.value || null,
            }))
          }}
        />
      </div>
    ),
    scopes: (
      <div className={classes.fieldItem}>
        <div className={classes.outerLabel}>{t('fields.scopes')}:</div>
        <div className={classes.scopeCard}>
          <GluuAutocomplete
            name="scopes"
            label={t('fields.scopes')}
            value={selectedScopeNames}
            options={scopeNameOptions}
            onChange={handleScopeChange}
            onBlur={() => formik.setFieldTouched?.('scopes', true, false)}
            onSearch={setScopeSearchQuery}
            isLoading={scopeLoading}
            disabled={viewOnly}
            placeholder={t('placeholders.search_scope')}
            doc_category={DOC_CATEGORY}
            inputBackgroundColor={themeColors.settings?.cardBackground}
            cardBackgroundColor={themeColors.settings?.cardBackground}
            withWrapper={false}
            hideLabel
          />
        </div>
      </div>
    ),
    redirectUris: (
      <div className={classes.fieldItem}>
        <GluuDynamicList
          label={`${t(CLIENT_DYNAMIC_LIST_I18N.REDIRECT_URIS.fieldKey)}:`}
          title={t(CLIENT_DYNAMIC_LIST_I18N.REDIRECT_URIS.fieldKey)}
          required
          items={redirectUriItems}
          mode="single"
          valuePlaceholder={t(CLIENT_DYNAMIC_LIST_I18N.REDIRECT_URIS.placeholderKey)}
          addButtonLabel={t('actions.add_redirect_url')}
          removeButtonLabel={t('actions.remove')}
          validateItem={(item) => uriValidator(item.value ?? '')}
          showError={!viewOnly && Boolean(redirectUrisError)}
          errorMessage={redirectUrisError}
          disabled={viewOnly}
          onAdd={handleAddRedirectUri}
          onChange={handleChangeRedirectUri}
          onRemove={handleRemoveRedirectUri}
        />
      </div>
    ),
  } as const

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        {client.inum && (
          <div className={classes.fieldItemFullWidth}>
            <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="inum">
              <FormGroup>
                <GluuLabel label="fields.inum" size={12} />
                <Input
                  className={classes.inumInput}
                  id="inum"
                  name="inum"
                  disabled
                  defaultValue={String(client.inum)}
                  readOnly
                  placeholder={t('placeholders.enter_here')}
                />
              </FormGroup>
            </GluuTooltip>
          </div>
        )}
        {CLIENT_BASIC_SECTION_GROUPS.flatMap((section) =>
          getClientSectionFields(fieldMap, section),
        )}
      </div>
    </div>
  )
}

export default ClientBasicPanel
