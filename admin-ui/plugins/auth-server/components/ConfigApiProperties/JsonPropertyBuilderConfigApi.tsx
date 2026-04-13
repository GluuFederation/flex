import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Accordion, FormGroup, Col } from 'Components'
import { GluuButton } from '@/components'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTranslation } from 'react-i18next'
import { getIn } from 'formik'
import customColors from '@/customColors'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, SPACING } from '@/constants'
import { buildKeyCandidates } from '@/utils/stringUtils'
import { REGEX_LEADING_SLASH, REGEX_FORWARD_SLASH } from '@/utils/regex'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from '../AuthServerProperties/styles/JsonPropertyBuilder.style'
import type {
  MultiSelectOption,
  GluuMultiSelectRowFormik,
} from 'Routes/Apps/Gluu/types/GluuMultiSelectRow.types'
import type { JsonPropertyBuilderConfigApiProps, AccordionWithSubComponents } from './types'
import type { JsonPatch } from 'JansConfigApi'
import type { AppConfiguration } from '../AuthServerProperties/types'
import {
  isNumber,
  isBoolean,
  isString,
  isStringArray,
  shouldRenderAsBoolean,
  shouldRenderAsString,
  shouldRenderAsStringArray,
  shouldRenderAsNumber,
  getBooleanValue,
  getStringValue,
  getNumberValue,
  getStringArrayValue,
  generateLabel,
  isObject,
  isObjectArray,
} from './utils'

const AccordionWithSub = Accordion as AccordionWithSubComponents
const AccordionHeader = AccordionWithSub.Header
const AccordionBody = AccordionWithSub.Body

const ERROR_CONTAINER_STYLE: React.CSSProperties = {
  marginTop: '-1.75rem',
  marginBottom: 0,
}

const FORM_GROUP_STYLE: React.CSSProperties = {
  marginBottom: 0,
  marginTop: 0,
}

const ERROR_COL_STYLE: React.CSSProperties = {
  paddingTop: 0,
  paddingBottom: 0,
}

const ERROR_TEXT_STYLE: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  lineHeight: '1.2',
  paddingTop: '2px',
}

const JsonPropertyBuilderConfigApi = ({
  propKey,
  propValue,
  lSize,
  path: initialPath,
  handler,
  parentIsArray = false,
  schema,
  doc_category = 'json_properties',
  tooltipPropKey = '',
  parent,
  disabled = false,
  errors,
  touched,
}: JsonPropertyBuilderConfigApiProps): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const [show, setShow] = useState(true)

  const getLocalizedLabelKey = useCallback(
    (key: string): string => {
      const candidates = buildKeyCandidates(key)

      for (const candidate of candidates) {
        const i18nKey = `fields.${candidate}`
        if (i18n.exists(i18nKey)) {
          return i18nKey
        }
      }

      const fallbackKey = `fields.${key}`
      if (!i18n.exists(fallbackKey)) {
        i18n.addResource(i18n.language, 'translation', fallbackKey, generateLabel(key))
      }
      return fallbackKey
    },
    [i18n],
  )

  useEffect(() => {
    setShow(true)
  }, [propValue])

  const path = useMemo(() => {
    if (!initialPath) {
      return `/${propKey}`
    }
    if (parentIsArray && !isNaN(parseInt(propKey))) {
      return initialPath
    }
    return `${initialPath}/${propKey}`
  }, [initialPath, propKey, parentIsArray])

  const uniqueId = useMemo(
    () => path.replace(REGEX_FORWARD_SLASH, '-').substring(1) || propKey,
    [path, propKey],
  )

  const formikPath = useMemo(() => {
    if (!path) return propKey
    return path.replace(REGEX_LEADING_SLASH, '').replace(REGEX_FORWARD_SLASH, '.')
  }, [path, propKey])

  const fieldError = useMemo(() => {
    if (!errors) return undefined
    return getIn(errors, formikPath)
  }, [errors, formikPath])

  const fieldTouched = useMemo(() => {
    if (!touched) return false
    return getIn(touched, formikPath) === true
  }, [touched, formikPath])

  const removeHandler = useCallback(() => {
    if (!show) {
      return
    }

    const patch: JsonPatch = {
      path,
      op: 'remove',
    }

    setShow(false)
    handler(patch)
  }, [path, handler, show])

  const renderError = useCallback(() => {
    if (!fieldTouched || !fieldError) return null
    if (typeof fieldError === 'object' && fieldError !== null) return null
    return (
      <div style={ERROR_CONTAINER_STYLE}>
        <FormGroup row style={FORM_GROUP_STYLE}>
          <Col sm={10}>
            <FormGroup row style={FORM_GROUP_STYLE}>
              <Col sm={lSize}></Col>
              <Col sm={lSize} style={ERROR_COL_STYLE}>
                <div className="text-danger small" style={ERROR_TEXT_STYLE}>
                  {String(fieldError)}
                </div>
              </Col>
            </FormGroup>
          </Col>
        </FormGroup>
      </div>
    )
  }, [fieldTouched, fieldError, lSize])

  if (isBoolean(propValue) || shouldRenderAsBoolean(schema)) {
    return (
      <>
        <GluuInlineInput
          id={uniqueId}
          name={tooltipPropKey || propKey}
          lsize={lSize}
          rsize={lSize}
          label={getLocalizedLabelKey(propKey)}
          isBoolean={true}
          handler={handler}
          value={getBooleanValue(propValue, schema)}
          parentIsArray={parentIsArray}
          path={path}
          doc_category={doc_category}
          disabled={disabled}
          showSaveButtons={false}
        />
        {renderError()}
      </>
    )
  }

  if (isString(propValue) || shouldRenderAsString(schema)) {
    const isPasswordField = propKey.toLowerCase().includes('password')

    if (isPasswordField) {
      return (
        <>
          <GluuInputRow
            name={tooltipPropKey || propKey}
            type="password"
            lsize={lSize}
            rsize={lSize}
            label={getLocalizedLabelKey(propKey)}
            value={getStringValue(propValue, schema)}
            doc_category={doc_category}
            doc_entry={tooltipPropKey || propKey}
            disabled={disabled}
            allowPasswordToggleWhenDisabled
            placeholder={getFieldPlaceholder(t, getLocalizedLabelKey(propKey))}
          />
          {renderError()}
        </>
      )
    }

    return (
      <>
        <GluuInlineInput
          id={uniqueId}
          name={tooltipPropKey || propKey}
          lsize={lSize}
          rsize={lSize}
          label={getLocalizedLabelKey(propKey)}
          handler={handler}
          value={getStringValue(propValue, schema)}
          parentIsArray={parentIsArray}
          path={path}
          doc_category={doc_category}
          disabled={disabled}
          showSaveButtons={false}
          placeholder={getFieldPlaceholder(t, getLocalizedLabelKey(propKey))}
        />
        {renderError()}
      </>
    )
  }

  if (isNumber(propValue, schema) || shouldRenderAsNumber(schema)) {
    return (
      <>
        <GluuInputRow
          name={tooltipPropKey || propKey}
          type="number"
          lsize={lSize}
          rsize={lSize}
          label={getLocalizedLabelKey(propKey)}
          value={getNumberValue(propValue, schema) ?? 0}
          doc_category={doc_category}
          doc_entry={tooltipPropKey || propKey}
          disabled={disabled}
          handleChange={(e) => {
            if (!path) return
            const patch: JsonPatch = {
              op: 'replace',
              path,
              value: Number(e.target.value),
            }
            handler(patch)
          }}
        />
        {renderError()}
      </>
    )
  }

  const arrayValues = useMemo(
    () =>
      isStringArray(propValue) || shouldRenderAsStringArray(schema)
        ? getStringArrayValue(propValue, schema)
        : [],
    [propValue, schema],
  )

  const selectOptions = useMemo<MultiSelectOption[]>(() => {
    if (!isStringArray(propValue) && !shouldRenderAsStringArray(schema)) return []
    const enumOptions = Array.from(new Set(schema?.items?.enum || arrayValues))
    return enumOptions.map((v: string) => ({ value: v, label: v }))
  }, [propValue, schema, arrayValues])

  const arrayFormikAdapter = useMemo<GluuMultiSelectRowFormik>(
    () => ({
      setFieldValue: (_field: string, newValues: string[]) => {
        if (!path) return
        handler({ op: 'replace', path, value: newValues })
      },
      setFieldTouched: () => {},
    }),
    [handler, path],
  )

  const sortedObjectKeys = useMemo(() => {
    if (!isObject(propValue)) return []
    const objVal = propValue as AppConfiguration
    const allKeys = Object.keys(objVal)
    const inputKeys = allKeys.filter((k) => {
      const v = objVal[k]
      return typeof v === 'string' || typeof v === 'number'
    })
    const booleanKeys = allKeys.filter((k) => typeof objVal[k] === 'boolean')
    const arrKeys = allKeys.filter((k) => {
      const v = objVal[k]
      return Array.isArray(v) && !isObjectArray(v)
    })
    const complexKeys = allKeys.filter((k) => isObject(objVal[k]) || isObjectArray(objVal[k]))
    return [...inputKeys, ...booleanKeys, ...arrKeys, ...complexKeys]
  }, [propValue])

  if (isStringArray(propValue) || shouldRenderAsStringArray(schema)) {
    return (
      <>
        <GluuMultiSelectRow
          label={getLocalizedLabelKey(propKey)}
          name={tooltipPropKey || propKey}
          value={arrayValues}
          formik={arrayFormikAdapter}
          options={selectOptions}
          lsize={lSize}
          rsize={lSize}
          disabled={disabled}
        />
        {renderError()}
      </>
    )
  }

  if (isObjectArray(propValue)) {
    const arrayValue = (Array.isArray(propValue) ? propValue : []) as AppConfiguration[]
    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <AccordionHeader>
          <span>{t(getLocalizedLabelKey(propKey))}</span>
        </AccordionHeader>
        <AccordionBody>
          {arrayValue.length === 0 ? (
            <GluuText variant="span">{t('messages.no_data_available')}</GluuText>
          ) : (
            arrayValue.map((item, index) => {
              const itemPath = `${path}/${index}`
              const itemObj = item as AppConfiguration
              const itemIdentifier =
                (itemObj.directory as string) || (itemObj.name as string) || `item-${index}`
              const stableKey = `${path}-${itemIdentifier}`
              return (
                <JsonPropertyBuilderConfigApi
                  key={stableKey}
                  propKey={String(index)}
                  propValue={item}
                  handler={handler}
                  lSize={lSize}
                  parentIsArray={true}
                  parent={propKey}
                  path={itemPath}
                  doc_category={doc_category}
                  disabled={disabled}
                  errors={errors}
                  touched={touched}
                />
              )
            })
          )}
        </AccordionBody>
      </Accordion>
    )
  }

  if (isObject(propValue)) {
    const isArrayItem = !isNaN(parseInt(propKey))

    const getLabelForArrayItem = (): string => {
      if (parent && isNaN(parseInt(parent))) {
        return `${generateLabel(parent)} ${parseInt(propKey) + 1}`
      }
      return `Item ${parseInt(propKey) + 1}`
    }
    const displayLabel = isArrayItem ? getLabelForArrayItem() : t(getLocalizedLabelKey(propKey))

    return (
      <>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <AccordionHeader>
              <div className={classes.accordionHeaderRow}>
                <GluuText variant="span">{displayLabel}</GluuText>
                {parentIsArray && (
                  <GluuButton
                    type="button"
                    className="remove-btn"
                    onClick={removeHandler}
                    backgroundColor={customColors.accentRed}
                    textColor={customColors.white}
                    borderColor={customColors.accentRed}
                    fontSize="14px"
                    fontWeight={600}
                    minHeight={36}
                    borderRadius={BORDER_RADIUS.SMALL}
                    padding={`${CEDARLING_CONFIG_SPACING.RADIO_LABEL_MB}px ${SPACING.SECTION_GAP / 2}px`}
                    useOpacityOnHover
                    disabled={disabled}
                  >
                    <i className={`fa fa-remove ${classes.removeButtonIcon}`} aria-hidden />
                    {t('actions.remove')}
                  </GluuButton>
                )}
              </div>
            </AccordionHeader>
            <AccordionBody>
              {Object.keys(propValue as AppConfiguration).length === 0 ? (
                <GluuText variant="span">{t('messages.no_data_available')}</GluuText>
              ) : (
                <div className={classes.objectFieldsGrid}>
                  {sortedObjectKeys.map((objKey) => {
                    const objVal = propValue as AppConfiguration
                    let tooltipKey = ''

                    if (isNaN(parseInt(propKey))) {
                      tooltipKey = `${propKey}.${objKey}`
                    } else if (parent) {
                      tooltipKey = `${parent}.${objKey}`
                    }

                    const nestedValue = objVal[objKey]
                    const isComplex = isObject(nestedValue) || isObjectArray(nestedValue)
                    return (
                      <div
                        key={objKey}
                        className={
                          isComplex || sortedObjectKeys.length === 1
                            ? classes.objectFieldItemFullWidth
                            : classes.objectFieldItem
                        }
                      >
                        <JsonPropertyBuilderConfigApi
                          propKey={objKey}
                          tooltipPropKey={tooltipKey}
                          propValue={nestedValue}
                          handler={handler}
                          lSize={12}
                          parentIsArray={false}
                          path={path}
                          doc_category={doc_category}
                          disabled={disabled}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </AccordionBody>
          </Accordion>
        )}
      </>
    )
  }

  return <></>
}

export default React.memo(JsonPropertyBuilderConfigApi)
