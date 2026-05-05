import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuDynamicList } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToggleRow from 'Routes/Apps/Gluu/GluuToggleRow'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { CLIENT_DYNAMIC_LIST_I18N, CLIENT_LOGOUT_MODIFIED_FIELDS, DOC_CATEGORY } from '../constants'
import { getClientAttributeValue } from '../helper/utils'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './styles/ClientLogoutPanel.style'
import {
  appendDynamicListItem,
  getDynamicListValidationMessage,
  mapDynamicListValues,
  uriValidator,
} from 'Plugins/auth-server/utils'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { ClientPanelProps } from '../types'

const ClientLogoutPanel = ({
  formik,
  viewOnly,
  setModifiedFields,
}: ClientPanelProps): JSX.Element => {
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
  const [backchannelLogoutUriItems, setBackchannelLogoutUriItems] = useState<GluuDynamicListItem[]>(
    [],
  )
  const [postLogoutRedirectUriItems, setPostLogoutRedirectUriItems] = useState<
    GluuDynamicListItem[]
  >([])
  const isBackchannelLogoutUriSyncingRef = useRef(false)
  const isPostLogoutRedirectUriSyncingRef = useRef(false)

  const backchannelLogoutUri = getClientAttributeValue<string[]>(
    formik.values,
    'backchannelLogoutUri',
    [],
  )
  const backchannelLogoutSessionRequired = getClientAttributeValue<boolean>(
    formik.values,
    'backchannelLogoutSessionRequired',
  )
  const backchannelLogoutUriError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: backchannelLogoutUriItems,
        t,
        validateItem: (item) => uriValidator(item.value ?? ''),
        invalidMessage: t('validation_messages.invalid_url_format'),
      }),
    [backchannelLogoutUriItems, t],
  )
  const postLogoutRedirectUriError = useMemo(
    () =>
      getDynamicListValidationMessage({
        items: postLogoutRedirectUriItems,
        t,
        validateItem: (item) => uriValidator(item.value ?? ''),
        invalidMessage: t('validation_messages.invalid_url_format'),
      }),
    [postLogoutRedirectUriItems, t],
  )

  useEffect(() => {
    const nextUris = (backchannelLogoutUri ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setBackchannelLogoutUriItems((currentItems) => {
      const currentUris = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isBackchannelLogoutUriSyncingRef.current) {
        isBackchannelLogoutUriSyncingRef.current = false
        if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems
      }

      if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems

      return mapDynamicListValues(nextUris)
    })
  }, [backchannelLogoutUri])

  useEffect(() => {
    const nextUris = ((formik.values.postLogoutRedirectUris as string[] | undefined) ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setPostLogoutRedirectUriItems((currentItems) => {
      const currentUris = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isPostLogoutRedirectUriSyncingRef.current) {
        isPostLogoutRedirectUriSyncingRef.current = false
        if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems
      }

      if (JSON.stringify(nextUris) === JSON.stringify(currentUris)) return currentItems

      return mapDynamicListValues(nextUris)
    })
  }, [formik.values.postLogoutRedirectUris])

  const syncBackchannelLogoutUris = useCallback(
    (items: GluuDynamicListItem[]) => {
      setBackchannelLogoutUriItems(items)
      const nextUris = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isBackchannelLogoutUriSyncingRef.current = true
      formik.setFieldValue('attributes.backchannelLogoutUri', nextUris)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_LOGOUT_MODIFIED_FIELDS.BACKCHANNEL_LOGOUT_URI]: nextUris,
      }))
    },
    [formik, setModifiedFields],
  )

  const syncPostLogoutRedirectUris = useCallback(
    (items: GluuDynamicListItem[]) => {
      setPostLogoutRedirectUriItems(items)
      const nextUris = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isPostLogoutRedirectUriSyncingRef.current = true
      formik.setFieldValue('postLogoutRedirectUris', nextUris)
      setModifiedFields((prev) => ({
        ...prev,
        [CLIENT_LOGOUT_MODIFIED_FIELDS.POST_LOGOUT_REDIRECT_URIS]: nextUris,
      }))
    },
    [formik, setModifiedFields],
  )

  const handleAddBackchannelLogoutUri = useCallback(() => {
    setBackchannelLogoutUriItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeBackchannelLogoutUri = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...backchannelLogoutUriItems]
      nextItems[index] = { ...nextItems[index], value }
      syncBackchannelLogoutUris(nextItems)
    },
    [backchannelLogoutUriItems, syncBackchannelLogoutUris],
  )

  const handleRemoveBackchannelLogoutUri = useCallback(
    (index: number) => {
      const nextItems = backchannelLogoutUriItems.filter((_, itemIndex) => itemIndex !== index)
      syncBackchannelLogoutUris(nextItems)
    },
    [backchannelLogoutUriItems, syncBackchannelLogoutUris],
  )

  const handleAddPostLogoutRedirectUri = useCallback(() => {
    setPostLogoutRedirectUriItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangePostLogoutRedirectUri = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...postLogoutRedirectUriItems]
      nextItems[index] = { ...nextItems[index], value }
      syncPostLogoutRedirectUris(nextItems)
    },
    [postLogoutRedirectUriItems, syncPostLogoutRedirectUris],
  )

  const handleRemovePostLogoutRedirectUri = useCallback(
    (index: number) => {
      const nextItems = postLogoutRedirectUriItems.filter((_, itemIndex) => itemIndex !== index)
      syncPostLogoutRedirectUris(nextItems)
    },
    [postLogoutRedirectUriItems, syncPostLogoutRedirectUris],
  )

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.frontChannelLogoutUri"
            name="frontChannelLogoutUri"
            formik={formik}
            value={(formik.values.frontChannelLogoutUri as string) ?? ''}
            placeholder={getFieldPlaceholder(t, 'fields.frontChannelLogoutUri')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            showError={
              isFieldTouched('frontChannelLogoutUri') &&
              Boolean(getFieldError('frontChannelLogoutUri'))
            }
            errorMessage={getFieldError('frontChannelLogoutUri')}
            handleChange={(e) => {
              setModifiedFields((prev) => ({
                ...prev,
                [CLIENT_LOGOUT_MODIFIED_FIELDS.FRONT_CHANNEL_LOGOUT_URI]: e.target.value,
              }))
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuToggleRow
            label="fields.frontChannelLogoutSessionRequired"
            name="frontChannelLogoutSessionRequired"
            formik={formik}
            value={Boolean(formik.values.frontChannelLogoutSessionRequired)}
            lsize={12}
            rsize={12}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handler={(e) => {
              setModifiedFields((prev) => ({
                ...prev,
                [CLIENT_LOGOUT_MODIFIED_FIELDS.FRONT_CHANNEL_LOGOUT_SESSION_REQUIRED]:
                  e.target.checked,
              }))
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuToggleRow
            name="attributes.backchannelLogoutSessionRequired"
            label="fields.backchannelLogoutSessionRequired"
            formik={formik}
            value={Boolean(backchannelLogoutSessionRequired)}
            lsize={12}
            rsize={12}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handler={(e) => {
              setModifiedFields((prev) => ({
                ...prev,
                [CLIENT_LOGOUT_MODIFIED_FIELDS.LOGOUT_SESSION_REQUIRED]: e.target.checked,
              }))
            }}
          />
        </div>
        <div className={classes.fieldItem} />
        <div className={classes.fieldItem}>
          <GluuDynamicList
            label={`${t(CLIENT_DYNAMIC_LIST_I18N.BACKCHANNEL_LOGOUT_URI.fieldKey)}:`}
            title={t(CLIENT_DYNAMIC_LIST_I18N.BACKCHANNEL_LOGOUT_URI.fieldKey)}
            items={backchannelLogoutUriItems}
            mode="single"
            valuePlaceholder={t(CLIENT_DYNAMIC_LIST_I18N.BACKCHANNEL_LOGOUT_URI.placeholderKey)}
            addButtonLabel={t('actions.add')}
            removeButtonLabel={t('actions.remove')}
            validateItem={(item) => uriValidator(item.value ?? '')}
            showError={!viewOnly && Boolean(backchannelLogoutUriError)}
            errorMessage={backchannelLogoutUriError}
            disabled={viewOnly}
            onAdd={handleAddBackchannelLogoutUri}
            onChange={handleChangeBackchannelLogoutUri}
            onRemove={handleRemoveBackchannelLogoutUri}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuDynamicList
            label={`${t(CLIENT_DYNAMIC_LIST_I18N.POST_LOGOUT_REDIRECT_URIS.fieldKey)}:`}
            title={t(CLIENT_DYNAMIC_LIST_I18N.POST_LOGOUT_REDIRECT_URIS.fieldKey)}
            items={postLogoutRedirectUriItems}
            mode="single"
            valuePlaceholder={t(CLIENT_DYNAMIC_LIST_I18N.POST_LOGOUT_REDIRECT_URIS.placeholderKey)}
            addButtonLabel={t('actions.add')}
            removeButtonLabel={t('actions.remove')}
            validateItem={(item) => uriValidator(item.value ?? '')}
            showError={!viewOnly && Boolean(postLogoutRedirectUriError)}
            errorMessage={postLogoutRedirectUriError}
            disabled={viewOnly}
            onAdd={handleAddPostLogoutRedirectUri}
            onChange={handleChangePostLogoutRedirectUri}
            onRemove={handleRemovePostLogoutRedirectUri}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientLogoutPanel
