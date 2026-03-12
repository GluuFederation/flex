import { Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import GluuToogle from 'Routes/Apps/Gluu/GluuToogle'
import PropTypes from 'prop-types'
import { FormikProps } from 'formik'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { InputProps } from 'reactstrap'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'

type ModifiedFieldValue = string | string[] | boolean
type FormikValues = Record<string, unknown>

interface GluuRemovableInputRowProps<TValues extends FormikValues = FormikValues> {
  label: string
  name: string
  type?: InputProps['type']
  value?: string | boolean
  formik: FormikProps<TValues>
  required?: boolean
  lsize?: number
  rsize?: number
  handler: () => void
  doc_category?: string
  isDirect?: boolean
  isBoolean?: boolean
  hideRemoveButton?: boolean
  modifiedFields: Record<string, ModifiedFieldValue>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, ModifiedFieldValue>>>
}

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
  const currentValue = formik.values[name as keyof TValues] as string | boolean | undefined
  const isChecked = (formik.values[name as keyof TValues] as boolean | undefined) ?? false

  const removeButton = (
    <button
      type="button"
      aria-label={t('actions.remove')}
      style={{
        width: 32,
        height: 32,
        minWidth: 32,
        minHeight: 32,
        padding: 6,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      onClick={handler}
    >
      <i className={'fa fa-fw fa-close'} style={{ color: themeColors.fontColor, fontSize: 16 }} />
    </button>
  )

  if (isBoolean) {
    return (
      <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GluuLabel label={label} size={3} required={required} />
          <GluuToogle
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
          {!hideRemoveButton && <div style={{ marginLeft: 'auto' }}>{removeButton}</div>}
        </div>
      </GluuTooltip>
    )
  }

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
      <div style={{ width: '100%' }}>
        <GluuLabel label={label} size={lsize} required={required} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Input
            id={name}
            data-testid={name}
            type={type}
            name={name}
            style={{ flex: 1, minWidth: 0 }}
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
    </GluuTooltip>
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
