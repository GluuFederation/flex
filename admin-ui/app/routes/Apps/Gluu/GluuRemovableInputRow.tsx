import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import applicationStyle from './styles/applicationStyle'
import GluuToogle from 'Routes/Apps/Gluu/GluuToogle'
import PropTypes from 'prop-types'
import { FormikProps } from 'formik'
import React, { useMemo } from 'react'
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
  modifiedFields: Record<string, ModifiedFieldValue>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, ModifiedFieldValue>>>
}

function GluuRemovableInputRow<TValues extends FormikValues = FormikValues>({
  label,
  name,
  type = 'text',
  value,
  formik,
  required = false,
  lsize = 3,
  rsize = 9,
  handler,
  doc_category,
  isDirect,
  isBoolean,
  modifiedFields,
  setModifiedFields,
}: GluuRemovableInputRowProps<TValues>) {
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const currentValue = formik.values[name as keyof TValues] as string | boolean | undefined
  const isChecked = (formik.values[name as keyof TValues] as boolean | undefined) ?? false

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
      <FormGroup row className="align-items-center">
        {isBoolean ? (
          <>
            <GluuLabel label={label} size={lsize} required={required} />
            <Col sm={rsize - 1}>
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
            </Col>
          </>
        ) : (
          <>
            <GluuLabel label={label} size={lsize} required={required} />
            <Col sm={rsize - 1}>
              <Input
                id={name}
                data-testid={name}
                type={type}
                name={name}
                value={(currentValue as string) ?? (value as string) ?? ''}
                onChange={(e) => {
                  setModifiedFields({
                    ...modifiedFields,
                    [name]: e.target.value,
                  })
                  formik.handleChange(e)
                }}
              />
            </Col>
          </>
        )}
        <div
          role="button"
          style={{
            ...(applicationStyle.removableInputRow as React.CSSProperties),
            width: 32,
            height: 32,
            padding: 6,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (e.key === ' ') e.preventDefault()
              handler()
            }
          }}
          onClick={() => handler()}
        >
          <i
            className={'fa fa-fw fa-close'}
            style={{ color: themeColors.fontColor, fontSize: 16 }}
          ></i>
        </div>
      </FormGroup>
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
  modifiedFields: PropTypes.object,
  setModifiedFields: PropTypes.func,
}
export default GluuRemovableInputRow
