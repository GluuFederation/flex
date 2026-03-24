import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  type ChangeEvent,
  type ReactElement,
} from 'react'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import applicationStyle from '@/routes/Apps/Gluu/styles/applicationStyle'
import { Col, InputGroup, CustomInput, FormGroup, Button } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import { type DropdownOption } from '../AuthN/helper/acrUtils'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface PutData {
  value: string | string[]
  path: string
  op: 'replace'
}

const PUT_VALUE_KEY = 'value'
const PUT_PATH_KEY = 'path'

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
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState<string[]>([])
  const [data, setData] = useState<string | undefined>(value)

  useEffect(() => {
    setData(value)
  }, [value])

  const onValueChanged = useCallback(
    (newData: string): void => {
      setShow(true)
      setData(newData)

      if (!showSaveButtons && newData) {
        const put: PutData = {
          [PUT_PATH_KEY]: path,
          [PUT_VALUE_KEY]: isArray ? (Array.isArray(newData) ? newData : [newData]) : newData,
          op: 'replace',
        }
        handler(put)
        setShow(false)
      }
    },
    [showSaveButtons, path, isArray, handler],
  )

  const onAccept = useCallback((): void => {
    const put: PutData = {
      [PUT_PATH_KEY]: path,
      [PUT_VALUE_KEY]: isArray ? correctValue : (data ?? ''),
      op: 'replace',
    }
    handler(put)
    setShow((prev) => !prev)
  }, [path, isArray, correctValue, data, handler])

  const onCancel = useCallback((): void => {
    setCorrectValue([])
    setShow((prev) => !prev)
  }, [])

  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onValueChanged(e.currentTarget.value)
    },
    [onValueChanged],
  )

  return (
    <FormGroup row>
      <Col sm={10}>
        <FormGroup row>
          <GluuLabel
            label={label}
            size={lsize}
            required={required}
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
                onChange={handleSelectChange}
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

export default React.memo(DefaultAcrInput)
