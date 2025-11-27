import GluuLabel from './GluuLabel'
import { Col, FormGroup, InputGroup } from 'Components'
import GluuTooltip from './GluuTooltip'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationstyle from './styles/applicationstyle'
import customColors from '@/customColors'
import { FormikProps } from 'formik'
import React from 'react'

type FormikFieldValue = string | string[] | boolean | null | undefined
type ModifiedFieldValue = string | string[] | boolean

type TypeaheadOptionObject = {
  role?: string
  customOption?: boolean
  label?: string
  [key: string]: string | number | boolean | null | undefined | string[]
}

type TypeaheadOption = string | TypeaheadOptionObject
type FormikValues = Record<string, FormikFieldValue>

interface GluuRemovableTypeAheadProps {
  label: string
  name: string
  value?: TypeaheadOption[]
  formik: FormikProps<FormikValues>
  lsize?: number
  rsize?: number
  handler: () => void
  doc_category?: string
  options?: TypeaheadOption[]
  isDirect?: boolean
  allowNew?: boolean
  modifiedFields?: Record<string, ModifiedFieldValue>
  setModifiedFields?: React.Dispatch<React.SetStateAction<Record<string, ModifiedFieldValue>>>
  disabled?: boolean
  placeholder?: string
}

const extractValueFromOption = (item: TypeaheadOption, fieldName: string): string | null => {
  if (typeof item === 'string') {
    return item
  }

  if (!item || typeof item !== 'object') {
    return null
  }

  if ('role' in item && typeof item.role === 'string') {
    return item.role
  }

  if ('label' in item && typeof item.label === 'string') {
    return item.label
  }

  const fieldValue = item[fieldName]
  if (typeof fieldValue === 'string') {
    return fieldValue
  }

  return null
}

function GluuRemovableTypeAhead({
  label,
  name,
  value,
  formik,
  lsize = 3,
  rsize = 9,
  handler,
  doc_category,
  options = [],
  isDirect,
  allowNew = true,
  modifiedFields,
  setModifiedFields,
  disabled = false,
  placeholder,
}: GluuRemovableTypeAheadProps) {
  const selectedValue = (formik.values[name] as TypeaheadOption[] | undefined) ?? value ?? []

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize - 1}>
          <InputGroup>
            <Typeahead
              allowNew={allowNew}
              emptyLabel=""
              labelKey={name}
              selected={selectedValue}
              onChange={(selected: TypeaheadOption[]) => {
                const names = selected
                  .map((item) => extractValueFromOption(item, name))
                  .filter((entry): entry is string => Boolean(entry))

                if (setModifiedFields) {
                  setModifiedFields({
                    ...(modifiedFields || {}),
                    [name]: names,
                  })
                }

                formik.setFieldValue(name, selected)
              }}
              id={name}
              data-testid={name}
              multiple={true}
              options={options}
              disabled={disabled}
              placeholder={placeholder}
            />
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
export default GluuRemovableTypeAhead
