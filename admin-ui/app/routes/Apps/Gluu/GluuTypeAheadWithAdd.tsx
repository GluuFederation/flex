import { useState, useCallback } from 'react'
import { FormGroup, Col, Row, Button, Input } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import applicationStyle from './styles/applicationStyle'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import customColors from '@/customColors'
import type { GluuTypeAheadWithAddProps } from './types'

const GluuTypeAheadWithAdd = ({
  label,
  name,
  value,
  placeholder,
  options,
  formik,
  validator,
  inputId,
  doc_category,
  lsize = 4,
  rsize = 8,
  disabled = false,
  handler = null,
  multiple = true,
}: GluuTypeAheadWithAddProps) => {
  const [items, setItems] = useState<string[]>(value ?? [])
  const [opts, setOpts] = useState<string[]>(options ?? [])
  const { t } = useTranslation()
  const { state } = useTheme()
  const selectedTheme = state.theme

  const addItem = useCallback(() => {
    const input = document.getElementById(inputId) as HTMLInputElement | null
    const newItem = input?.value ?? ''
    if (input) input.value = ''
    if (validator(newItem)) {
      const updatedItems = items ? [...items] : []
      updatedItems.push(newItem)

      const temp = opts ? [...opts] : []
      temp.push(...updatedItems)

      setOpts(temp)
      setItems(updatedItems)
      formik.setFieldValue(name, updatedItems)

      if (handler) {
        handler(name, updatedItems)
      }
    }
  }, [inputId, items, name, opts, formik, handler, validator])

  const handleChange = useCallback(
    (aName: string, selected: string[]) => {
      setOpts(selected)
      setItems(selected)
      formik.setFieldValue(aName, selected)
    },
    [formik],
  )

  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name} />
      <Col
        sm={rsize}
        style={{
          borderStyle: 'solid',
          borderRadius: '5px',
          borderColor: customColors.logo,
        }}
      >
        &nbsp;
        <Row>
          <Col sm={10}>
            <Input
              placeholder={placeholder}
              id={inputId}
              disabled={disabled}
              data-testid="new_entry"
              aria-label="new_entry"
            />
          </Col>
          <Col>
            <Button
              color={`primary-${selectedTheme}`}
              type="button"
              disabled={disabled}
              style={applicationStyle.buttonStyle}
              onClick={addItem}
              data-testid={t('actions.add')}
            >
              <i className="fa fa-plus-circle me-2"></i>
              {t('actions.add')}
            </Button>
          </Col>
        </Row>
        &nbsp;
        <Typeahead
          emptyLabel=""
          labelKey={name}
          disabled={disabled}
          onChange={(selected) => handleChange(name, selected as string[])}
          id={name}
          data-testid={name}
          multiple={multiple}
          selected={items}
          options={opts}
        />
        &nbsp;
      </Col>
    </FormGroup>
  )
}

export default GluuTypeAheadWithAdd
