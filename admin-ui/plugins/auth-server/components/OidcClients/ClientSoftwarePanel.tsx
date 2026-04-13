import { useMemo } from 'react'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { useTranslation } from 'react-i18next'
import { REGEX_EMAIL } from '@/utils/regex'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { DOC_CATEGORY } from './constants'
import { useStyles } from './styles/ClientSoftwarePanel.style'
import type { ClientPanelProps } from './types'

const ORIGIN_INPUT_ID = 'origin_uri_id'
const CONTACT_INPUT_ID = 'contact_uri_id'

const uriValidator = (_uri: string): boolean => {
  return true
}

const emailValidator = (email: string): boolean => {
  return REGEX_EMAIL.test(email)
}

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

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.clientUri"
            name="clientUri"
            formik={formik}
            value={(formik.values.clientUri as string) || ''}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Client Uri': e.target.value })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.policy_uri"
            name="policyUri"
            formik={formik}
            value={(formik.values.policyUri as string) || ''}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Policy Uri': e.target.value })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.logo_uri"
            name="logoUri"
            formik={formik}
            value={(formik.values.logoUri as string) || ''}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'logo Uri': e.target.value })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.tosUri"
            name="tosUri"
            formik={formik}
            value={(formik.values.tosUri as string) || ''}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Tos Uri': e.target.value })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuTypeAheadWithAdd
            name="contacts"
            label="fields.contacts"
            formik={formik}
            placeholder={t('placeholders.email_example')}
            value={(formik.values.contacts as string[]) || []}
            options={[]}
            validator={emailValidator}
            inputId={CONTACT_INPUT_ID}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(_name: string, items: string[]) => {
              setModifiedFields({ ...modifiedFields, Contacts: items })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuTypeAheadWithAdd
            name="authorizedOrigins"
            label="fields.authorizedOrigins"
            formik={formik}
            placeholder={t('placeholders.valid_origin_uri')}
            value={(formik.values.authorizedOrigins as string[]) || []}
            options={[]}
            validator={uriValidator}
            inputId={ORIGIN_INPUT_ID}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(_name: string, items: string[]) => {
              setModifiedFields({ ...modifiedFields, 'Authorized Origins': items })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.softwareId"
            name="softwareId"
            formik={formik}
            value={formik.values.softwareId as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Software Id': e.target.value })
            }}
          />
        </div>

        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.softwareVersion"
            name="softwareVersion"
            formik={formik}
            value={formik.values.softwareVersion as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Software Version': e.target.value })
            }}
          />
        </div>

        <div className={classes.fieldItemFullWidth}>
          <GluuInputRow
            label="fields.softwareStatement"
            name="softwareStatement"
            formik={formik}
            value={formik.values.softwareStatement as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Software Statement': e.target.value })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientSoftwarePanel
