import React, { useState, useEffect, useContext } from 'react'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Col, InputGroup, CustomInput, FormGroup, Button } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'

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
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const VALUE = 'value'
  const PATH = 'path'
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState([])
  const [data, setData] = useState(value)

  useEffect(() => {
    setData(value)
  }, [value])

  const onValueChanged = (data) => {
    setShow(true)
    setData(data)

    if (!showSaveButtons && data) {
      const put = {}
      put[PATH] = path
      if (isArray) {
        put[VALUE] = correctValue
      } else {
        put[VALUE] = data
      }
      put['op'] = 'replace'
      handler(put)
      setShow(false)
    }
  }
  const onAccept = () => {
    const put = {}
    put[PATH] = path
    if (isArray) {
      put[VALUE] = correctValue
    } else {
      put[VALUE] = data
    }
    put['op'] = 'replace'
    handler(put)
    setShow(!show)
  }
  const onCancel = () => {
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
                onChange={(e) => {
                  onValueChanged(e.target.value)
                }}
              >
                <option value="">{t('actions.choose')}...</option>
                {options.map((item, key) => (
                  <option key={key}>{item}</option>
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
