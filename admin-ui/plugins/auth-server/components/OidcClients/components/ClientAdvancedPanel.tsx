import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { GluuDynamicList } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import { type Dayjs, createDate } from '@/utils/dayjsUtils'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { CEDARLING_CONFIG_SPACING } from '@/constants'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import {
  CLIENT_DYNAMIC_LIST_I18N,
  CLIENT_ADVANCED_SECTION_GROUPS,
  CLIENT_ADVANCED_MODIFIED_FIELDS,
  CLIENT_SCRIPT_TYPES,
  DOC_CATEGORY,
} from '../constants'
import {
  appendDynamicListItem,
  createPassiveSelectFormik,
  getDynamicListValidationMessage,
  getClientSectionFields,
  mapDynamicListValues,
  uriValidator,
} from 'Plugins/auth-server/utils'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './styles/ClientAdvancedPanel.style'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { ClientAdvancedPanelProps } from '../types'

const ClientAdvancedPanel = ({
  scripts,
  formik,
  viewOnly,
  setModifiedFields,
}: ClientAdvancedPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`
  const formErrors = formik.errors as Record<string, string | undefined> & {
    attributes?: Record<string, string | undefined>
  }
  const formTouched = formik.touched as Record<string, boolean | undefined> & {
    attributes?: Record<string, boolean | undefined>
  }
  const getFieldError = useCallback(
    (field: string) => {
      const error = formErrors[field]
      return typeof error === 'string' ? error : ''
    },
    [formErrors],
  )
  const isFieldTouched = useCallback((field: string) => Boolean(formTouched[field]), [formTouched])
  const attributeErrors =
    formErrors.attributes && typeof formErrors.attributes === 'object'
      ? formErrors.attributes
      : ({} as Record<string, string | undefined>)
  const attributeTouched =
    formTouched.attributes && typeof formTouched.attributes === 'object'
      ? formTouched.attributes
      : ({} as Record<string, boolean | undefined>)

  const [expirationDate, setExpirationDate] = useState<Dayjs | undefined>(
    formik.values.expirationDate
      ? createDate(formik.values.expirationDate as string | number | Date)
      : undefined,
  )
  const [requestUriItems, setRequestUriItems] = useState<GluuDynamicListItem[]>([])
  const [authorizedAcrItems, setAuthorizedAcrItems] = useState<GluuDynamicListItem[]>([])

  const filteredScripts = scripts
    .filter((item) => item.scriptType === CLIENT_SCRIPT_TYPES.PERSON_AUTHENTICATION)
    .filter((item) => item.enabled)
    .map((item) => item.name as string)

  const passiveSelectFormik = useMemo(
    () => createPassiveSelectFormik(formik.handleBlur),
    [formik.handleBlur],
  )
  const requestUrisError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: requestUriItems,
        t,
        validateItem: (item) => uriValidator(item.value ?? ''),
        invalidMessage: t('validation_messages.invalid_url_format'),
      }),
    [requestUriItems, t],
  )
  const authorizedAcrValuesError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: authorizedAcrItems,
        t,
      }),
    [authorizedAcrItems, t],
  )

  useEffect(() => {
    if (!formik.values.expirable) {
      formik.setFieldValue('expirationDate', null)
      setExpirationDate(undefined)
    }
  }, [formik.values.expirable])

  useEffect(() => {
    const nextUris = ((formik.values.requestUris as string[] | undefined) ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setRequestUriItems((currentItems) => {
      const currentUris = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems

      return mapDynamicListValues(nextUris)
    })
  }, [formik.values.requestUris])

  useEffect(() => {
    const nextValues = (
      (formik.values.attributes?.authorizedAcrValues as string[] | undefined) ?? []
    ).filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

    setAuthorizedAcrItems((currentItems) => {
      const currentValues = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (JSON.stringify(nextValues) === JSON.stringify(currentValues)) return currentItems

      return mapDynamicListValues(nextValues)
    })
  }, [formik.values.attributes?.authorizedAcrValues])

  const syncRequestUris = useCallback(
    (items: GluuDynamicListItem[]) => {
      setRequestUriItems(items)
      const nextUris = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      formik.setFieldValue('requestUris', nextUris)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_ADVANCED_MODIFIED_FIELDS.REQUEST_URIS]: nextUris,
      }))
    },
    [formik, setModifiedFields],
  )

  const handleAddRequestUri = useCallback(() => {
    setRequestUriItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeRequestUri = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...requestUriItems]
      nextItems[index] = { ...nextItems[index], value }
      syncRequestUris(nextItems)
    },
    [requestUriItems, syncRequestUris],
  )

  const handleRemoveRequestUri = useCallback(
    (index: number) => {
      const nextItems = requestUriItems.filter((_, itemIndex) => itemIndex !== index)
      syncRequestUris(nextItems)
    },
    [requestUriItems, syncRequestUris],
  )

  const syncAuthorizedAcrValues = useCallback(
    (items: GluuDynamicListItem[]) => {
      setAuthorizedAcrItems(items)
      const nextValues = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      formik.setFieldValue('attributes.authorizedAcrValues', nextValues)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_ADVANCED_MODIFIED_FIELDS.AUTHORIZED_ACR_VALUES]: nextValues,
      }))
    },
    [formik, setModifiedFields],
  )

  const handleAddAuthorizedAcr = useCallback(() => {
    setAuthorizedAcrItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeAuthorizedAcr = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...authorizedAcrItems]
      nextItems[index] = { ...nextItems[index], value }
      syncAuthorizedAcrValues(nextItems)
    },
    [authorizedAcrItems, syncAuthorizedAcrValues],
  )

  const handleRemoveAuthorizedAcr = useCallback(
    (index: number) => {
      const nextItems = authorizedAcrItems.filter((_, itemIndex) => itemIndex !== index)
      syncAuthorizedAcrValues(nextItems)
    },
    [authorizedAcrItems, syncAuthorizedAcrValues],
  )

  const fieldMap = {
    persistClientAuthorizations: (
      <div className={classes.fieldItem}>
        <GluuToogleRow
          name="persistClientAuthorizations"
          formik={formik}
          lsize={12}
          rsize={12}
          value={Boolean(formik.values.persistClientAuthorizations)}
          handler={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.PERSIST_CLIENT_AUTHORIZATIONS]: e.target.checked,
            }))
          }}
          label="fields.persist_client_authorizations"
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
        />
      </div>
    ),
    defaultPromptLogin: (
      <div className={classes.fieldItem}>
        <GluuToogleRow
          name="attributes.jansDefaultPromptLogin"
          formik={formik}
          lsize={12}
          rsize={12}
          label="fields.defaultPromptLogin"
          value={Boolean(formik.values.attributes?.jansDefaultPromptLogin)}
          handler={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.DEFAULT_PROMPT_LOGIN]: e.target.checked,
            }))
          }}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
        />
      </div>
    ),
    allowSpontaneousScopes: (
      <div className={classes.fieldItem}>
        <GluuToogleRow
          name="attributes.allowSpontaneousScopes"
          label="fields.allow_spontaneous_scopes"
          value={Boolean(formik.values?.attributes?.allowSpontaneousScopes)}
          formik={formik}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handler={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.ALLOW_SPONTANEOUS_SCOPES]: e.target.checked,
            }))
          }}
        />
      </div>
    ),
    spontaneousScopes: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          name="attributes.spontaneousScopes"
          label="fields.spontaneousScopesREGEX"
          formik={formik}
          value={(formik.values?.attributes?.spontaneousScopes as string[] | undefined)?.[0] ?? ''}
          placeholder={getFieldPlaceholder(t, 'fields.spontaneousScopesREGEX')}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          showError={
            Boolean(attributeTouched.spontaneousScopes) &&
            typeof attributeErrors.spontaneousScopes === 'string'
          }
          errorMessage={
            typeof attributeErrors.spontaneousScopes === 'string'
              ? attributeErrors.spontaneousScopes
              : ''
          }
          handleChange={(event) => {
            const arr = event.target.value ? [event.target.value] : []
            formik.setFieldValue('attributes.spontaneousScopes', arr)
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.SPONTANEOUS_SCOPES]: arr,
            }))
          }}
        />
      </div>
    ),
    initiateLoginUri: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.initiateLoginUri"
          name="initiateLoginUri"
          formik={formik}
          value={formik.values.initiateLoginUri as string | undefined}
          placeholder={getFieldPlaceholder(t, 'fields.initiateLoginUri')}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          showError={
            isFieldTouched('initiateLoginUri') && Boolean(getFieldError('initiateLoginUri'))
          }
          errorMessage={getFieldError('initiateLoginUri')}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.INITIATE_LOGIN_URI]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    requestUris: (
      <div className={classes.fieldItemFullWidth}>
        <GluuDynamicList
          label={`${t(CLIENT_DYNAMIC_LIST_I18N.REQUEST_URIS.fieldKey)}:`}
          title={t(CLIENT_DYNAMIC_LIST_I18N.REQUEST_URIS.fieldKey)}
          items={requestUriItems}
          mode="single"
          valuePlaceholder={t(CLIENT_DYNAMIC_LIST_I18N.REQUEST_URIS.placeholderKey)}
          addButtonLabel={t('actions.add')}
          removeButtonLabel={t('actions.remove')}
          validateItem={(item) => uriValidator(item.value ?? '')}
          showError={!viewOnly && Boolean(requestUrisError)}
          errorMessage={requestUrisError}
          disabled={viewOnly}
          onAdd={handleAddRequestUri}
          onChange={handleChangeRequestUri}
          onRemove={handleRemoveRequestUri}
          className={classes.dynamicListSelectAlign}
        />
      </div>
    ),
    defaultAcrValues: (
      <div className={classes.fieldItem}>
        <GluuSelectRow
          name="defaultAcrValues"
          label="fields.defaultAcrValues"
          formik={passiveSelectFormik}
          value={(formik.values.defaultAcrValues as string[] | undefined)?.[0] ?? ''}
          values={filteredScripts.map((s) => ({ value: s, label: s }))}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handleChange={(e) => {
            const val = e.target.value ? [e.target.value] : []
            formik.setFieldValue('defaultAcrValues', val)
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.DEFAULT_ACR_VALUES]: val,
            }))
          }}
        />
      </div>
    ),
    authorizedAcrValues: (
      <div className={classes.fieldItem}>
        <GluuDynamicList
          label={`${t(CLIENT_DYNAMIC_LIST_I18N.AUTHORIZED_ACR_VALUES.fieldKey)}:`}
          title={t(CLIENT_DYNAMIC_LIST_I18N.AUTHORIZED_ACR_VALUES.fieldKey)}
          items={authorizedAcrItems}
          mode="single"
          valuePlaceholder={getFieldPlaceholder(
            t,
            CLIENT_DYNAMIC_LIST_I18N.AUTHORIZED_ACR_VALUES.fieldKey,
          )}
          addButtonLabel={t('actions.add')}
          removeButtonLabel={t('actions.remove')}
          showError={!viewOnly && Boolean(authorizedAcrValuesError)}
          errorMessage={authorizedAcrValuesError}
          disabled={viewOnly}
          onAdd={handleAddAuthorizedAcr}
          onChange={handleChangeAuthorizedAcr}
          onRemove={handleRemoveAuthorizedAcr}
          className={classes.dynamicListSelectAlign}
        />
      </div>
    ),
    tlsClientAuthSubjectDn: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.tls_client_auth_subject_dn"
          name="attributes.tlsClientAuthSubjectDn"
          formik={formik}
          value={formik.values?.attributes?.tlsClientAuthSubjectDn as string | undefined}
          placeholder={getFieldPlaceholder(t, 'fields.tls_client_auth_subject_dn')}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          showError={
            Boolean(attributeTouched.tlsClientAuthSubjectDn) &&
            typeof attributeErrors.tlsClientAuthSubjectDn === 'string'
          }
          errorMessage={
            typeof attributeErrors.tlsClientAuthSubjectDn === 'string'
              ? attributeErrors.tlsClientAuthSubjectDn
              : ''
          }
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.TLS_CLIENT_AUTH_SUBJECT_DN]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    expirable: (
      <div className={classes.fieldItem}>
        <GluuToogleRow
          name="expirable"
          formik={formik}
          label="fields.is_expirable_client"
          value={Boolean(formik.values.expirable)}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          handler={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.IS_EXPIRABLE_CLIENT]: e.target.checked,
            }))
          }}
        />
      </div>
    ),
    expirationDate: formik.values.expirable ? (
      <div className={`${classes.fieldItem} ${classes.datePickerField}`}>
        <GluuLabel label="fields.expiration_date" size={12} />
        <GluuDatePicker
          value={expirationDate ?? null}
          minDate={createDate()}
          inputHeight={CEDARLING_CONFIG_SPACING.INPUT_HEIGHT}
          onChange={(date: Dayjs | null) => {
            if (!date) return
            formik.setFieldValue('expirationDate', new Date(date.toISOString()))
            setExpirationDate(date)
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_ADVANCED_MODIFIED_FIELDS.EXPIRATION_DATE]: new Date(
                date.toISOString(),
              ).toDateString(),
            }))
          }}
        />
      </div>
    ) : null,
  } as const

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        {CLIENT_ADVANCED_SECTION_GROUPS.flatMap((section) =>
          getClientSectionFields(fieldMap, section),
        )}
      </div>
    </div>
  )
}

export default ClientAdvancedPanel
