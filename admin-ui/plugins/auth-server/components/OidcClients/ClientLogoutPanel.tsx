import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { DOC_CATEGORY } from './constants'
import { getClientAttributeValue } from './helper/utils'
import { useStyles } from './styles/ClientLogoutPanel.style'
import type { ClientPanelProps } from './types'

const POST_URI_ID = 'post_uri_id'
const BACKCHANNEL_URI_ID = 'backchannel_uri_id'
const EMPTY_OPTIONS: string[] = []

const acceptAnyUriValidator = (_value: string): boolean => true

const ClientLogoutPanel = ({
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientPanelProps): JSX.Element => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`

  const backchannelLogoutUri = getClientAttributeValue<string[]>(
    formik.values,
    'backchannelLogoutUri',
    [],
  )
  const backchannelLogoutSessionRequired = getClientAttributeValue<boolean>(
    formik.values,
    'backchannelLogoutSessionRequired',
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
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                'Front Channel Logout Uri': e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuToogleRow
            name="frontChannelLogoutSessionRequired"
            lsize={12}
            rsize={12}
            formik={formik}
            label="fields.frontChannelLogoutSessionRequired"
            value={Boolean(formik.values.frontChannelLogoutSessionRequired)}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handler={(e) => {
              setModifiedFields({
                ...modifiedFields,
                'Front Channel Logout Session Required': e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuTypeAheadWithAdd
            name="attributes.backchannelLogoutUri"
            label="fields.backchannelLogoutUri"
            formik={formik}
            placeholder={t('placeholders.valid_uri_pattern')}
            value={backchannelLogoutUri ?? []}
            options={EMPTY_OPTIONS}
            validator={acceptAnyUriValidator}
            inputId={BACKCHANNEL_URI_ID}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(_name, items) => {
              setModifiedFields({
                ...modifiedFields,
                'Backchannel Logout Uri': items,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuBooleanSelectBox
            name="attributes.backchannelLogoutSessionRequired"
            label="fields.backchannelLogoutSessionRequired"
            value={backchannelLogoutSessionRequired}
            formik={formik}
            lsize={12}
            rsize={12}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handler={() => {
              setModifiedFields({
                ...modifiedFields,
                'Logout Session Required': !backchannelLogoutSessionRequired,
              })
            }}
          />
        </div>
        <div className={classes.fieldItemFullWidth}>
          <GluuTypeAheadWithAdd
            name="postLogoutRedirectUris"
            label="fields.post_logout_redirect_uris"
            formik={formik}
            placeholder={t('placeholders.post_logout_redirect_uris')}
            value={(formik.values.postLogoutRedirectUris as string[]) || []}
            options={EMPTY_OPTIONS}
            validator={acceptAnyUriValidator}
            inputId={POST_URI_ID}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(_name, items) => {
              setModifiedFields({
                ...modifiedFields,
                'Post Logout Redirect Uris': items,
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientLogoutPanel
