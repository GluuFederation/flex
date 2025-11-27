import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuTooltip from './GluuTooltip'
import applicationstyle from './styles/applicationstyle'
import customColors from '@/customColors'
import { FormikProps } from 'formik'
import React from 'react'

type ModifiedFieldValue = string | string[] | boolean
type FormikValues = Record<string, unknown>

interface CountryOption {
  name: string
  cca2: string
}

interface GluuRemovableSelectRowProps {
  label: string
  name: string
  value?: string
  formik: FormikProps<FormikValues>
  values?: CountryOption[]
  lsize?: number
  rsize?: number
  handler: () => void
  doc_category?: string
  isDirect?: boolean
  modifiedFields: Record<string, ModifiedFieldValue>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, ModifiedFieldValue>>>
}

function GluuRemovableSelectRow({
  label,
  name,
  value,
  formik,
  values = [],
  lsize = 3,
  rsize = 9,
  handler,
  doc_category,
  isDirect,
  modifiedFields,
  setModifiedFields,
}: GluuRemovableSelectRowProps) {
  const currentValue = (formik.values[name] as string | undefined) ?? value ?? ''

  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize - 1}>
          <InputGroup>
            <CustomInput
              type="select"
              id={name}
              data-testid={name}
              name={name}
              value={currentValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setModifiedFields({
                  ...modifiedFields,
                  [name]: e.target.value,
                })
                formik.handleChange(e)
              }}
            >
              <option value="">{t('actions.choose')}...</option>
              {values.map((item) => (
                <option value={item.cca2} key={item.cca2}>
                  {item.name}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
        </Col>
        <div
          style={applicationstyle.removableInputRow as React.CSSProperties}
          onClick={() => handler()}
        >
          <i className={'fa fa-fw fa-close'} style={{ color: customColors.accentRed }}></i>
        </div>
      </FormGroup>
    </GluuTooltip>
  )
}
export default GluuRemovableSelectRow
