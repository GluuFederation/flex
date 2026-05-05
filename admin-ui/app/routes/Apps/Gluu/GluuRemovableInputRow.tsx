import { Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuToggle from 'Routes/Apps/Gluu/GluuToggle'
import PropTypes from 'prop-types'
import type { FormikValues } from 'formik'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './styles/GluuRemovableInputRow.style'
import type { GluuRemovableInputRowProps } from './types'
import { Close as CloseIcon } from '@/components/icons'

const GluuRemovableInputRow = <TValues extends FormikValues = FormikValues>({
  label,
  name,
  type = 'text',
  value,
  formik,
  required = false,
  lsize = 3,
  handler,
  doc_category,
  isDirect,
  isBoolean,
  hideRemoveButton,
  modifiedFields,
  setModifiedFields,
}: GluuRemovableInputRowProps<TValues>) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles({ fontColor: themeColors.fontColor })
  const currentValue = formik.values[name as keyof TValues] as string | boolean | undefined
  const isChecked = (formik.values[name as keyof TValues] as boolean | undefined) ?? false

  const removeButton = (
    <button
      type="button"
      aria-label={t('actions.remove')}
      className={classes.removeButton}
      onClick={handler}
    >
      <CloseIcon className={classes.removeIcon} />
    </button>
  )

  if (isBoolean) {
    return (
      <div className={classes.booleanRow}>
        <GluuLabel
          label={label}
          size={3}
          required={required}
          doc_category={doc_category}
          doc_entry={name}
          isDirect={isDirect}
        />
        <GluuToggle
          name={name}
          id={name}
          formik={formik}
          value={isChecked}
          handler={(e: React.ChangeEvent<HTMLInputElement>) => {
            setModifiedFields({
              ...modifiedFields,
              [name]: e.target.checked,
            })
            formik.setFieldValue(name, e.target.checked)
          }}
        />
        {!hideRemoveButton && <div className={classes.booleanRemoveWrapper}>{removeButton}</div>}
      </div>
    )
  }

  return (
    <div className={classes.inputWrapper}>
      <GluuLabel
        label={label}
        size={lsize}
        required={required}
        doc_category={doc_category}
        doc_entry={name}
        isDirect={isDirect}
      />
      <div className={classes.inputRow}>
        <Input
          id={name}
          data-testid={name}
          type={type}
          name={name}
          className={classes.input}
          value={(currentValue as string) ?? (value as string) ?? ''}
          onChange={(e) => {
            setModifiedFields({
              ...modifiedFields,
              [name]: e.target.value,
            })
            formik.handleChange(e)
          }}
        />
        {!hideRemoveButton && removeButton}
      </div>
    </div>
  )
}

GluuRemovableInputRow.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  formik: PropTypes.object,
  required: PropTypes.bool,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  handler: PropTypes.func,
  doc_category: PropTypes.string,
  isDirect: PropTypes.bool,
  isBoolean: PropTypes.bool,
  hideRemoveButton: PropTypes.bool,
  modifiedFields: PropTypes.object,
  setModifiedFields: PropTypes.func,
}
export default GluuRemovableInputRow
