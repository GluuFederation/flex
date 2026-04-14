import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GluuDynamicList } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { CLIENT_SOFTWARE_MODIFIED_FIELDS, DOC_CATEGORY } from './constants'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './components/styles/ClientSoftwarePanel.style'
import { appendDynamicListItem, mapDynamicListValues } from 'Plugins/auth-server/utils'
import type { GluuDynamicListItem } from '@/components/GluuDynamicList'
import type { ClientPanelProps } from './types'

const ClientSoftwarePanel = ({
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`
  const [contactItems, setContactItems] = useState<GluuDynamicListItem[]>([])
  const [authorizedOriginItems, setAuthorizedOriginItems] = useState<GluuDynamicListItem[]>([])
  const isContactsSyncingRef = useRef(false)
  const isAuthorizedOriginsSyncingRef = useRef(false)

  useEffect(() => {
    const nextContacts = ((formik.values.contacts as string[] | undefined) ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setContactItems((currentItems) => {
      const currentContacts = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isContactsSyncingRef.current) {
        isContactsSyncingRef.current = false
        if (JSON.stringify(nextContacts) === JSON.stringify(currentContacts)) return currentItems
      }

      if (JSON.stringify(nextContacts) === JSON.stringify(currentContacts)) return currentItems

      return mapDynamicListValues(nextContacts)
    })
  }, [formik.values.contacts])

  useEffect(() => {
    const nextOrigins = ((formik.values.authorizedOrigins as string[] | undefined) ?? []).filter(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )

    setAuthorizedOriginItems((currentItems) => {
      const currentOrigins = currentItems
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)

      if (isAuthorizedOriginsSyncingRef.current) {
        isAuthorizedOriginsSyncingRef.current = false
        if (JSON.stringify(nextOrigins) === JSON.stringify(currentOrigins)) return currentItems
      }

      if (JSON.stringify(nextOrigins) === JSON.stringify(currentOrigins)) return currentItems

      return mapDynamicListValues(nextOrigins)
    })
  }, [formik.values.authorizedOrigins])

  const syncContacts = useCallback(
    (items: GluuDynamicListItem[]) => {
      setContactItems(items)
      const nextContacts = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isContactsSyncingRef.current = true
      formik.setFieldValue('contacts', nextContacts)
      setModifiedFields({
        ...modifiedFields,
        [CLIENT_SOFTWARE_MODIFIED_FIELDS.CONTACTS]: nextContacts,
      })
    },
    [formik, modifiedFields, setModifiedFields],
  )

  const syncAuthorizedOrigins = useCallback(
    (items: GluuDynamicListItem[]) => {
      setAuthorizedOriginItems(items)
      const nextOrigins = items
        .map((item) => item.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
      isAuthorizedOriginsSyncingRef.current = true
      formik.setFieldValue('authorizedOrigins', nextOrigins)
      setModifiedFields({
        ...modifiedFields,
        [CLIENT_SOFTWARE_MODIFIED_FIELDS.AUTHORIZED_ORIGINS]: nextOrigins,
      })
    },
    [formik, modifiedFields, setModifiedFields],
  )

  const handleAddContact = useCallback(() => {
    setContactItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeContact = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...contactItems]
      nextItems[index] = { ...nextItems[index], value }
      syncContacts(nextItems)
    },
    [contactItems, syncContacts],
  )

  const handleRemoveContact = useCallback(
    (index: number) => {
      const nextItems = contactItems.filter((_, itemIndex) => itemIndex !== index)
      syncContacts(nextItems)
    },
    [contactItems, syncContacts],
  )

  const handleAddAuthorizedOrigin = useCallback(() => {
    setAuthorizedOriginItems((current) => appendDynamicListItem(current))
  }, [])

  const handleChangeAuthorizedOrigin = useCallback(
    (index: number, _field: 'key' | 'value', value: string) => {
      const nextItems = [...authorizedOriginItems]
      nextItems[index] = { ...nextItems[index], value }
      syncAuthorizedOrigins(nextItems)
    },
    [authorizedOriginItems, syncAuthorizedOrigins],
  )

  const handleRemoveAuthorizedOrigin = useCallback(
    (index: number) => {
      const nextItems = authorizedOriginItems.filter((_, itemIndex) => itemIndex !== index)
      syncAuthorizedOrigins(nextItems)
    },
    [authorizedOriginItems, syncAuthorizedOrigins],
  )

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.clientUri"
            name="clientUri"
            formik={formik}
            value={(formik.values.clientUri as string) || ''}
            placeholder={getFieldPlaceholder(t, 'fields.clientUri')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.CLIENT_URI]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.policy_uri"
            name="policyUri"
            formik={formik}
            value={(formik.values.policyUri as string) || ''}
            placeholder={getFieldPlaceholder(t, 'fields.policy_uri')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.POLICY_URI]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.logo_uri"
            name="logoUri"
            formik={formik}
            value={(formik.values.logoUri as string) || ''}
            placeholder={getFieldPlaceholder(t, 'fields.logo_uri')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.LOGO_URI]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.tosUri"
            name="tosUri"
            formik={formik}
            value={(formik.values.tosUri as string) || ''}
            placeholder={getFieldPlaceholder(t, 'fields.tosUri')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.TOS_URI]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.softwareId"
            name="softwareId"
            formik={formik}
            value={formik.values.softwareId as string | undefined}
            placeholder={getFieldPlaceholder(t, 'fields.softwareId')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.SOFTWARE_ID]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.softwareVersion"
            name="softwareVersion"
            formik={formik}
            value={formik.values.softwareVersion as string | undefined}
            placeholder={getFieldPlaceholder(t, 'fields.softwareVersion')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.SOFTWARE_VERSION]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.softwareStatement"
            name="softwareStatement"
            formik={formik}
            value={formik.values.softwareStatement as string | undefined}
            placeholder={getFieldPlaceholder(t, 'fields.softwareStatement')}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                [CLIENT_SOFTWARE_MODIFIED_FIELDS.SOFTWARE_STATEMENT]: e.target.value,
              })
            }}
          />
        </div>

        <div className={classes.fieldItem} />

        <div className={classes.fieldItem}>
          <GluuDynamicList
            label={`${t('fields.authorizedOrigins')}:`}
            title={t('fields.authorizedOrigins')}
            items={authorizedOriginItems}
            mode="single"
            valuePlaceholder={t('placeholders.valid_origin_uri')}
            addButtonLabel={t('actions.add')}
            removeButtonLabel={t('actions.remove')}
            disabled={viewOnly}
            onAdd={handleAddAuthorizedOrigin}
            onChange={handleChangeAuthorizedOrigin}
            onRemove={handleRemoveAuthorizedOrigin}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuDynamicList
            label={`${t('fields.contacts')}:`}
            title={t('fields.contacts')}
            items={contactItems}
            mode="single"
            valuePlaceholder={t('placeholders.email_example')}
            addButtonLabel={t('actions.add')}
            removeButtonLabel={t('actions.remove')}
            disabled={viewOnly}
            onAdd={handleAddContact}
            onChange={handleChangeContact}
            onRemove={handleRemoveContact}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientSoftwarePanel
