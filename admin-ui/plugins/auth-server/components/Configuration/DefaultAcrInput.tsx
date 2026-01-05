import React, { useState, useEffect, useContext, type ChangeEvent, type ReactElement } from 'react'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Col, InputGroup, CustomInput, FormGroup, Button } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { type DropdownOption } from '../AuthN/helper/acrUtils'

interface PutData {
  value: string | string[]
  path: string
  op: 'replace'
}

interface DefaultAcrInputProps {
  label: string
  name: string
  value?: string
  required?: boolean
  lsize?: number
  rsize?: number
  isArray?: boolean
  handler: (put: PutData) => void
  options: (DropdownOption | string)[]
  path: string
  showSaveButtons?: boolean
}

function DefaultAcrInput({
  label,
  name,
  value,
  required = false,
  lsize = 3,
  rsize = 9,
  isArray,
  handler,
  options,
  path,
  showSaveButtons = true,
}: DefaultAcrInputProps): ReactElement {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'light'
  const VALUE = 'value'
  const PATH = 'path'
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState<string[]>([])
  const [data, setData] = useState<string | undefined>(value)

  useEffect(() => {
    setData(value)
  }, [value])

  const onValueChanged = (newData: string): void => {
    setShow(true)
    setData(newData)

    if (!showSaveButtons && newData) {
      const put: PutData = {
        [PATH]: path,
        [VALUE]: isArray ? (Array.isArray(newData) ? newData : [newData]) : newData,
        op: 'replace',
      }
      handler(put)
      setShow(false)
    }
  }

  const onAccept = (): void => {
    const put: PutData = {
      [PATH]: path,
      [VALUE]: isArray ? correctValue : (data ?? ''),
      op: 'replace',
    }
    handler(put)
    setShow(!show)
  }

  const onCancel = (): void => {
    setCorrectValue([])
    setShow(!show)
  }

  return (
    <FormGroup row>
      <Col sm={10}>
        <FormGroup row>
          <GluuLabel
            label={label}
            size={lsize}
            required={required}
            withTooltip={false}
            doc_category="json_properties"
            doc_entry={name}
          />
          <Col sm={rsize}>
            <InputGroup>
              <CustomInput
                type="select"
                data-testid={name}
                id={name}
                name={name}
                value={data}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  onValueChanged(e.target.value)
                }}
              >
                <option value="">{t('actions.choose')}...</option>
                {options.map((item, key) => (
                  <option key={key} value={typeof item === 'object' ? item.value : item}>
                    {typeof item === 'object' ? item.label : item}
                  </option>
                ))}
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>
      </Col>
      <Col sm={2}>
        {show && showSaveButtons && (
          <>
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              size="sm"
              onClick={onAccept}
            >
              <i className="fa fa-check me-2"></i>
            </Button>{' '}
            <Button color="danger" size="sm" onClick={onCancel}>
              <i className="fa fa-times me-2"></i>
            </Button>
          </>
        )}
      </Col>
    </FormGroup>
  )
}

export default DefaultAcrInput
