import React from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuBooleanSelectBox from 'Routes/Apps/Gluu/GluuBooleanSelectBox'
import GluuTypeAheadWithAdd from 'Routes/Apps/Gluu/GluuTypeAheadWithAdd'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { DOC_CATEGORY } from './constants'
import { useStyles } from './styles/ClientTokensPanel.style'
import type { ClientPanelProps } from './types'

const AUDIENCE_INPUT_ID = 'audience_id'

function audienceValidator(_aud: string): boolean {
  return true
}

const ClientTokensPanel = ({
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}: ClientPanelProps) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = React.useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const gridClass = `${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`

  return (
    <div className={classes.root}>
      <div className={gridClass}>
        <div className={`${classes.fieldItem} ${classes.radioGroupWrap}`}>
          <FormGroup row>
            <GluuLabel
              label="fields.accessTokenAsJwt"
              size={12}
              doc_category={DOC_CATEGORY}
              doc_entry="accessTokenAsJwt"
            />
            <Col sm={12}>
              <RadioGroup
                row
                name="accessTokenAsJwt"
                value={formik.values.accessTokenAsJwt?.toString() || 'true'}
                onChange={(e) => {
                  formik.setFieldValue(
                    'accessTokenAsJwt',
                    e.target.value === 'true' ? 'true' : 'false',
                  )
                  setModifiedFields({ ...modifiedFields, 'Access Token as jwt': e.target.value })
                }}
              >
                <FormControlLabel
                  value={'true'}
                  control={<Radio color="primary" />}
                  label={t('options.jwt')}
                  disabled={viewOnly}
                />
                <FormControlLabel
                  value={'false'}
                  control={<Radio color="primary" />}
                  label={t('options.reference')}
                  disabled={viewOnly}
                />
              </RadioGroup>
            </Col>
          </FormGroup>
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.accessTokenLifetime"
            name="accessTokenLifetime"
            formik={formik}
            type="number"
            value={formik.values.accessTokenLifetime as number | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Access token lifetime': e.target.value })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.refreshTokenLifetime"
            name="refreshTokenLifetime"
            formik={formik}
            type="number"
            value={formik.values.refreshTokenLifetime as number | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Refresh token lifetime': e.target.value })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuToogleRow
            name="includeClaimsInIdToken"
            lsize={12}
            rsize={12}
            formik={formik}
            label="fields.includeClaimsInIdToken"
            value={formik.values.includeClaimsInIdToken as boolean}
            doc_category={DOC_CATEGORY}
            disabled={viewOnly}
            handler={(e: React.ChangeEvent<HTMLInputElement>) => {
              setModifiedFields({
                ...modifiedFields,
                'Include claims in id token': e.target.checked,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.defaultMaxAge"
            name="defaultMaxAge"
            formik={formik}
            type="number"
            value={formik.values.defaultMaxAge as number | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Default max age': e.target.value })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuInputRow
            label="fields.idTokenTokenBindingCnf"
            name="idTokenTokenBindingCnf"
            formik={formik}
            value={formik.values.idTokenTokenBindingCnf as string | undefined}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handleChange={(e) => {
              setModifiedFields({ ...modifiedFields, 'Id token token binding cnf': e.target.value })
            }}
          />
        </div>
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
              setModifiedFields({
                ...modifiedFields,
                'Run introspection script before jwt creation': e.target.value,
              })
            }}
          />
        </div>
        <div className={classes.fieldItem}>
          <GluuTypeAheadWithAdd
            name="attributes.additionalAudience"
            label="fields.additionalAudience"
            formik={formik}
            value={(formik.values.attributes?.additionalAudience as string[]) || []}
            options={[]}
            validator={audienceValidator}
            inputId={AUDIENCE_INPUT_ID}
            doc_category={DOC_CATEGORY}
            lsize={12}
            rsize={12}
            disabled={viewOnly}
            handler={(_name: string, items: string[]) => {
              setModifiedFields({ ...modifiedFields, 'Additional audience': items })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientTokensPanel
