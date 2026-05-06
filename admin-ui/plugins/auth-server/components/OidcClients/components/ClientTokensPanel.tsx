import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GluuDynamicList } from 'Components'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import {
  CLIENT_DYNAMIC_LIST_I18N,
  DOC_CATEGORY,
  ACCESS_TOKEN_TYPE_OPTIONS,
  CLIENT_STEP_TWO_TOKEN_ROWS,
  CLIENT_TOKEN_MODIFIED_FIELDS,
} from '../constants'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './styles/ClientTokensPanel.style'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { ClientPanelProps } from '../types'
import type { SelectOption } from 'Routes/Apps/Gluu/types/GluuSelectRow.types'
import {
  appendDynamicListItem,
  getDynamicListValidationMessage,
  mapDynamicListValues,
  mapTranslatedOptions,
} from 'Plugins/auth-server/utils'

const ClientTokensPanel = ({ formik, viewOnly, setModifiedFields }: ClientPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`
  const formErrors = formik.errors as Record<string, string | undefined>
  const formTouched = formik.touched as Record<string, boolean | undefined>
  const getFieldError = useCallback(
    (field: string) => {
      const error = formErrors[field]
      return typeof error === 'string' ? error : ''
    },
    [formErrors],
  )
  const isFieldTouched = useCallback((field: string) => Boolean(formTouched[field]), [formTouched])
  const [audienceItems, setAudienceItems] = useState<GluuDynamicListItem[]>([])
  const isAudienceSyncingRef = useRef(false)

  const accessTokenTypeOptions = useMemo<SelectOption[]>(
    () => mapTranslatedOptions(ACCESS_TOKEN_TYPE_OPTIONS, t),
    [t],
  )
  const orderedFieldKeys = useMemo(() => CLIENT_STEP_TWO_TOKEN_ROWS.flat(), [])
  const additionalAudienceError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: audienceItems,
        t,
      }),
    [audienceItems, t],
  )

  useEffect(() => {
    const nextAudiences = (
      (formik.values.attributes?.additionalAudience as string[] | undefined) ?? []
    ).filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

    setAudienceItems((currentItems) => {
      const currentAudiences = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isAudienceSyncingRef.current) {
        isAudienceSyncingRef.current = false
        if (JSON.stringify(nextAudiences) === JSON.stringify(currentAudiences)) {
          return currentItems
        }
      }

      if (JSON.stringify(nextAudiences) === JSON.stringify(currentAudiences)) {
        return currentItems
      }

      return mapDynamicListValues(nextAudiences)
    })
  }, [formik.values.attributes?.additionalAudience])

  const syncAudiences = useCallback(
    (items: GluuDynamicListItem[]) => {
      setAudienceItems(items)
      const nextAudiences = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isAudienceSyncingRef.current = true
      formik.setFieldValue('attributes.additionalAudience', nextAudiences)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_TOKEN_MODIFIED_FIELDS.ADDITIONAL_AUDIENCE]: nextAudiences,
      }))
    },
    [formik, setModifiedFields],
  )

  const handleAddAudience = useCallback(() => {
    setAudienceItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeAudience = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...audienceItems]
      nextItems[index] = { ...nextItems[index], value }
      syncAudiences(nextItems)
    },
    [audienceItems, syncAudiences],
  )

  const handleRemoveAudience = useCallback(
    (index: number) => {
      const nextItems = audienceItems.filter((_, itemIndex) => itemIndex !== index)
      syncAudiences(nextItems)
    },
    [audienceItems, syncAudiences],
  )

  const fieldMap = {
    accessTokenAsJwt: (
      <div className={classes.fieldItem}>
        <GluuSelectRow
          label="fields.accessTokenAsJwt"
          name="accessTokenAsJwt"
          formik={formik}
          value={formik.values.accessTokenAsJwt?.toString() ?? 'false'}
          values={accessTokenTypeOptions}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.ACCESS_TOKEN_AS_JWT]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    accessTokenLifetime: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.accessTokenLifetime"
          name="accessTokenLifetime"
          formik={formik}
          type="number"
          value={formik.values.accessTokenLifetime as number | undefined}
          placeholder={getFieldPlaceholder(t, 'fields.accessTokenLifetime')}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          showError={
            isFieldTouched('accessTokenLifetime') && Boolean(getFieldError('accessTokenLifetime'))
          }
          errorMessage={getFieldError('accessTokenLifetime')}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.ACCESS_TOKEN_LIFETIME]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    refreshTokenLifetime: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.refreshTokenLifetime"
          name="refreshTokenLifetime"
          formik={formik}
          type="number"
          value={formik.values.refreshTokenLifetime as number | undefined}
          placeholder={getFieldPlaceholder(t, 'fields.refreshTokenLifetime')}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          showError={
            isFieldTouched('refreshTokenLifetime') && Boolean(getFieldError('refreshTokenLifetime'))
          }
          errorMessage={getFieldError('refreshTokenLifetime')}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.REFRESH_TOKEN_LIFETIME]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    defaultMaxAge: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.defaultMaxAge"
          name="defaultMaxAge"
          formik={formik}
          type="number"
          value={formik.values.defaultMaxAge as number | undefined}
          placeholder={getFieldPlaceholder(t, 'fields.defaultMaxAge')}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          showError={isFieldTouched('defaultMaxAge') && Boolean(getFieldError('defaultMaxAge'))}
          errorMessage={getFieldError('defaultMaxAge')}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.DEFAULT_MAX_AGE]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    idTokenTokenBindingCnf: (
      <div className={classes.fieldItem}>
        <GluuInputRow
          label="fields.idTokenTokenBindingCnf"
          name="idTokenTokenBindingCnf"
          formik={formik}
          value={formik.values.idTokenTokenBindingCnf as string | undefined}
          placeholder={getFieldPlaceholder(t, 'fields.idTokenTokenBindingCnf')}
          doc_category={DOC_CATEGORY}
          lsize={12}
          rsize={12}
          disabled={viewOnly}
          showError={
            isFieldTouched('idTokenTokenBindingCnf') &&
            Boolean(getFieldError('idTokenTokenBindingCnf'))
          }
          errorMessage={getFieldError('idTokenTokenBindingCnf')}
          handleChange={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.ID_TOKEN_TOKEN_BINDING_CNF]: e.target.value,
            }))
          }}
        />
      </div>
    ),
    includeClaimsInIdToken: (
      <div className={classes.fieldItem}>
        <GluuToggleRow
          name="includeClaimsInIdToken"
          lsize={12}
          rsize={12}
          formik={formik}
          label="fields.includeClaimsInIdToken"
          value={formik.values.includeClaimsInIdToken as boolean}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handler={(e: React.ChangeEvent<HTMLInputElement>) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.INCLUDE_CLAIMS_IN_ID_TOKEN]: e.target.checked,
            }))
          }}
        />
      </div>
    ),
    runIntrospectionScriptBeforeJwtCreation: (
      <div className={classes.fieldItem}>
        <GluuBooleanSelectBox
          name="attributes.runIntrospectionScriptBeforeJwtCreation"
          label="fields.run_introspection_script_before_accesstoken"
          value={Boolean(formik.values.attributes?.runIntrospectionScriptBeforeJwtCreation)}
          formik={formik}
          lsize={12}
          rsize={12}
          doc_category={DOC_CATEGORY}
          disabled={viewOnly}
          handler={(e) => {
            setModifiedFields((prev) => ({
              ...prev,
              [CLIENT_TOKEN_MODIFIED_FIELDS.RUN_INTROSPECTION_SCRIPT_BEFORE_JWT_CREATION]:
                e.target.value,
            }))
          }}
        />
      </div>
    ),
    additionalAudience: (
      <div className={classes.fieldItem}>
        <GluuDynamicList
          label={`${t(CLIENT_DYNAMIC_LIST_I18N.ADDITIONAL_AUDIENCE.fieldKey)}:`}
          title={t(CLIENT_DYNAMIC_LIST_I18N.ADDITIONAL_AUDIENCE.fieldKey)}
          items={audienceItems}
          mode="single"
          valuePlaceholder={getFieldPlaceholder(
            t,
            CLIENT_DYNAMIC_LIST_I18N.ADDITIONAL_AUDIENCE.fieldKey,
          )}
          addButtonLabel={t('actions.add')}
          removeButtonLabel={t('actions.remove')}
          showError={!viewOnly && Boolean(additionalAudienceError)}
          errorMessage={additionalAudienceError}
          disabled={viewOnly}
          onAdd={handleAddAudience}
          onChange={handleChangeAudience}
          onRemove={handleRemoveAudience}
          className={classes.dynamicListSelectAlign}
        />
      </div>
    ),
  } as const

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        {orderedFieldKeys.map((fieldKey) => (
          <div key={fieldKey}>{fieldMap[fieldKey]}</div>
        ))}
      </div>
    </div>
  )
}

export default ClientTokensPanel
