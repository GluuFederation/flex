import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react'
import GluuLabel from './GluuLabel'
import GluuToogle from './GluuToogle'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Col, FormGroup, Input, Button } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'
import type { JsonPatch } from 'JansConfigApi'

interface GluuInlineInputProps {
  label: string
  name: string
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url'
  value?: string | number | boolean | string[]
  required?: boolean
  lsize?: number
  rsize?: number
  isBoolean?: boolean
  isArray?: boolean
  handler: (patch: JsonPatch) => void
  options?: string[]
  path?: string
  doc_category?: string
  disabled?: boolean
  id?: string
  parentIsArray?: boolean
  showSaveButtons?: boolean
}

interface ThemeContextValue {
  state: {
    theme: string
  }
}

const GluuInlineInput = ({
  label,
  name,
  type = 'text',
  value,
  required = false,
  lsize = 3,
  rsize = 9,
  isBoolean,
  isArray,
  handler,
  options,
  path,
  doc_category = 'json_properties',
  disabled = false,
  id,
  showSaveButtons = true,
}: GluuInlineInputProps) => {
  const theme = useContext(ThemeContext) as ThemeContextValue
  const selectedTheme = theme.state.theme
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState<string[]>([])
  const [data, setData] = useState<string | number | boolean>(
    value !== undefined && !Array.isArray(value) ? (value as string | number | boolean) : '',
  )

  useEffect(() => {
    if (value !== undefined && !Array.isArray(value)) {
      setData(value as string | number | boolean)
    }
  }, [value])

  const isValidPath = useMemo(() => path && typeof path === 'string' && path.trim() !== '', [path])

  const onValueChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }
      const nextValue = isBoolean ? e.target.checked : e.target.value
      setData(nextValue)
      if (showSaveButtons) {
        setShow(true)
      } else if (isValidPath) {
        const patch: JsonPatch = {
          op: 'replace',
          path: path as string,
          value: nextValue,
        }
        handler(patch)
      }
    },
    [disabled, isBoolean, showSaveButtons, isValidPath, path, handler],
  )

  const handleTypeAheadChange = useCallback(
    (selectedOptions: (string | Record<string, string>)[]) => {
      if (disabled) {
        return
      }
      const object = selectedOptions.filter(
        (item): item is Record<string, string> => typeof item === 'object',
      )
      const arrayItems = selectedOptions.filter(
        (item): item is string => typeof item !== 'object',
      ) as string[]

      for (const obj of object) {
        if (!obj.tokenEndpointAuthMethodsSupported) {
          const value = obj[name]
          if (typeof value === 'string') {
            arrayItems.push(value)
          }
        } else {
          const value = obj.tokenEndpointAuthMethodsSupported
          if (typeof value === 'string') {
            arrayItems.push(value)
          }
        }
      }
      setCorrectValue(arrayItems)
      if (showSaveButtons) {
        setShow(true)
      } else if (isValidPath) {
        const patch: JsonPatch = {
          op: 'replace',
          path: path as string,
          value: arrayItems,
        }
        handler(patch)
      }
    },
    [disabled, name, showSaveButtons, path, handler],
  )

  const onAccept = useCallback(() => {
    if (disabled || !isValidPath) {
      return
    }
    const patch: JsonPatch = {
      op: 'replace',
      path,
      value: isArray ? correctValue : data,
    } as JsonPatch
    handler(patch)
    setShow((prev) => !prev)
  }, [disabled, isValidPath, isArray, correctValue, data, handler, path])

  const onCancel = useCallback(() => {
    setCorrectValue([])
    setShow((prev) => !prev)
  }, [])

  const disabledStyle = useMemo(
    () => (disabled ? { cursor: 'not-allowed', opacity: 0.6 } : {}),
    [disabled],
  )

  const filteredValue = useMemo(
    () => (Array.isArray(value) ? value.filter((item) => item != null) : []),
    [value],
  )

  const filteredOptions = useMemo(
    () => (Array.isArray(options) ? options.filter((item) => item != null) : []),
    [options],
  )
  const resolvedId = id || name
  return (
    <FormGroup row>
      <Col sm={10}>
        <FormGroup row>
          <GluuLabel
            label={label}
            size={lsize}
            required={required}
            doc_category={doc_category}
            doc_entry={name}
          />
          <Col sm={rsize}>
            {!isBoolean && !isArray && (
              <Input
                id={resolvedId}
                data-testid={resolvedId}
                name={name}
                type={type}
                defaultValue={String(data)}
                onChange={onValueChanged}
                disabled={disabled}
                style={disabledStyle}
              />
            )}
            {isBoolean && (
              <GluuToogle
                id={resolvedId}
                data-testid={resolvedId}
                name={name}
                handler={onValueChanged}
                value={value as boolean}
                disabled={disabled}
              />
            )}
            {isArray && (
              <Typeahead
                id={resolvedId}
                data-testid={resolvedId}
                allowNew
                emptyLabel=""
                labelKey={name}
                onChange={handleTypeAheadChange}
                multiple={true}
                defaultSelected={filteredValue}
                options={filteredOptions}
                disabled={disabled}
              />
            )}
          </Col>
        </FormGroup>
      </Col>
      <Col sm={2}>
        {show && showSaveButtons && !disabled && (
          <>
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              size="sm"
              onClick={onAccept}
            >
              <i className="fa fa-check me-2" />
            </Button>
            <Button
              style={{
                backgroundColor: customColors.accentRed,
                color: customColors.white,
                border: 'none',
              }}
              size="sm"
              onClick={onCancel}
            >
              <i className="fa fa-times me-2"></i>
            </Button>
          </>
        )}
      </Col>
    </FormGroup>
  )
}

export default GluuInlineInput
