import React, { useEffect, useMemo, useState } from 'react'
import { Col, FormGroup } from 'Components'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuTypeAheadForDn from 'Routes/Apps/Gluu/GluuTypeAheadForDn'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { useTranslation } from 'react-i18next'
import ClientShowSpontaneousScopes from './ClientShowSpontaneousScopes'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { DOC_CATEGORY } from './constants'
import { useStyles } from './styles/ClientAdvancedPanel.style'
import type { ClientAdvancedPanelProps } from './types'

const REQUEST_URI_INPUT_ID = 'request_uri_id'

const uriValidator = (_uri: string): boolean => {
  return true
}

const getMapping = (partial: string[] | undefined, total: string[]): string[] => {
  if (!partial) return []
  return total.filter((item) => partial.includes(item))
}

const ClientAdvancedPanel = ({
  client,
  scripts,
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientAdvancedPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`

  const [scopesModal, setScopesModal] = useState(false)
  const [expirationDate, setExpirationDate] = useState<Dayjs | undefined>(
    formik.values.expirationDate
      ? dayjs(formik.values.expirationDate as string | number | Date)
      : undefined,
  )

  const filteredScripts = scripts
    .filter((item) => item.scriptType === 'person_authentication')
    .filter((item) => item.enabled)
    .map((item) => item.name as string)

  useEffect(() => {
    if (!formik.values.expirable) {
      formik.setFieldValue('expirationDate', null)
      setExpirationDate(undefined)
    }
  }, [formik.values.expirable])

  return (
    <div className={classes.root}>
      <ClientShowSpontaneousScopes
        handler={() => setScopesModal((v) => !v)}
        isOpen={scopesModal}
        clientInum={client.inum}
      />

      <div className={gridClass}>
        <div className={classes.fieldItem}>
          <GluuToogleRow
            name="persistClientAuthorizations"
            lsize={12}
            rsize={12}
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('persistClientAuthorizations', e.target.checked)
              setModifiedFields({
                ...modifiedFields,
                'Persist Client Authorizations': e.target.checked,
              })
            }}
            label="fields.persist_client_authorizations"
            value={formik.values.persistClientAuthorizations as boolean}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuToogleRow
            name="attributes.jansDefaultPromptLogin"
            lsize={12}
            rsize={12}
            label="fields.defaultPromptLogin"
            value={formik.values.attributes?.jansDefaultPromptLogin as boolean}
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              formik.setFieldValue('attributes.jansDefaultPromptLogin', e.target.checked)
              setModifiedFields({ ...modifiedFields, 'Default Prompt Login': e.target.checked })
            }}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuBooleanSelectBox
            name="attributes.allowSpontaneousScopes"
            label="fields.allow_spontaneous_scopes"
            value={Boolean(formik.values?.attributes?.allowSpontaneousScopes)}
            formik={formik}
            lsize={12}
            rsize={12}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handler={(e) => {
              setModifiedFields({ ...modifiedFields, 'Allow Spontaneous Scopes': e.target.value })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuTypeAheadForDn
            name="attributes.spontaneousScopes"
            label="fields.spontaneousScopesREGEX"
            formik={formik}
            value={((formik.values?.attributes?.spontaneousScopes as string[]) || []).map((s) => ({
              dn: s,
            }))}
            options={((formik.values?.attributes?.spontaneousScopes as string[]) || []).map(
              (s) => ({ dn: s }),
            )}
            haveLabelKey={false}
            allowNew={true}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            onChange={(selected) => {
              setModifiedFields({
                ...modifiedFields,
                'Spontaneous Scopes': selected.map((s) => s.dn ?? ''),
              })
            }}
          />
        </div>
        {client.inum ? (
          <div className={classes.fieldItemFullWidth}>
            <GluuTooltip doc_category={DOC_CATEGORY} doc_entry="spontaneousScopesViewContent">
              <FormGroup row>
                <GluuLabel label="fields.spontaneousScopes" size={12} />
                <Col sm={12}>
                  <a onClick={() => setScopesModal((v) => !v)} className="common-link">
                    {t('actions.view_current')}
                  </a>
                </Col>
              </FormGroup>
            </GluuTooltip>
          </div>
        ) : null}
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.initiateLoginUri"
            name="initiateLoginUri"
            formik={formik}
            value={formik.values.initiateLoginUri as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Initiate Login Uri': e.target.value })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuTypeAheadWithAdd
            name="requestUris"
            label="fields.requestUris"
            formik={formik}
            placeholder={t('placeholders.valid_request_uri')}
            value={(formik.values.requestUris as string[]) || []}
            options={[]}
            validator={uriValidator}
            inputId={REQUEST_URI_INPUT_ID}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(_name: string, items: string[]) => {
              setModifiedFields({ ...modifiedFields, 'Request Uris': items })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuTypeAhead
            name="defaultAcrValues"
            label="fields.defaultAcrValues"
            formik={formik}
            value={getMapping(
              formik.values.defaultAcrValues as string[] | undefined,
              filteredScripts,
            )}
            options={filteredScripts}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            onChange={(selected) => {
              setModifiedFields({
                ...modifiedFields,
                'Default Acr Values': selected.map((s) => String(s)),
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuTypeAhead
            name="attributes.authorizedAcrValues"
            label="fields.authorizedAcrValues"
            formik={formik}
            value={getMapping(
              (formik.values?.attributes?.authorizedAcrValues as string[] | undefined) || [],
              filteredScripts,
            )}
            options={filteredScripts}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            onChange={(selected) => {
              setModifiedFields({
                ...modifiedFields,
                'Authorized Acr Values': selected.map((s) => String(s)),
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.tls_client_auth_subject_dn"
            name="attributes.tlsClientAuthSubjectDn"
            formik={formik}
            value={formik.values?.attributes?.tlsClientAuthSubjectDn as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'TLS Client Auth Subject Dn': e.target.value })
            }}
          />
        </div>
      </div>

      <div className={gridClass}>
        <div className={classes.fieldItem}>
          <GluuToogleRow
            name="expirable"
            formik={formik}
            label="fields.is_expirable_client"
            value={formik.values.expirable as boolean}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              setModifiedFields({ ...modifiedFields, 'Is Expirable Client': e.target.checked })
            }}
          />
        </div>
        <div className={classes.fieldItemFullWidth}>
          {formik.values.expirable ? (
            <FormGroup row>
              <Col sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    disablePast
                    value={expirationDate ?? null}
                    onChange={(date: Dayjs | null) => {
                      if (!date) return
                      formik.setFieldValue('expirationDate', new Date(date.toISOString()))
                      setExpirationDate(date)
                      setModifiedFields({
                        ...modifiedFields,
                        'Expiration Date': new Date(date.toISOString()).toDateString(),
                      })
                    }}
                  />
                </LocalizationProvider>
              </Col>
            </FormGroup>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ClientAdvancedPanel
