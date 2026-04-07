import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Accordion, FormGroup, Col } from 'Components'
import { GluuButton } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import customColors from '@/customColors'
import { BORDER_RADIUS, CEDARLING_CONFIG_SPACING, SPACING } from '@/constants'
import { useTranslation } from 'react-i18next'
import { getIn } from 'formik'
import { buildKeyCandidates } from '@/utils/stringUtils'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import type {
  MultiSelectOption,
  GluuMultiSelectRowFormik,
} from 'Routes/Apps/Gluu/types/GluuMultiSelectRow.types'
import { useStyles } from './styles/JsonPropertyBuilder.style'
import type {
  JsonPropertyBuilderProps,
  AccordionWithSubComponents,
  AppConfiguration,
  StringArrayFieldProps,
  PropertyValue,
} from './types'
import type { JsonPatch } from 'JansConfigApi'
import {
  isString,
  isStringArray,
  isEmptyArray,
  isBoolean,
  isNumber,
  shouldRenderAsBoolean,
  shouldRenderAsString,
  shouldRenderAsStringArray,
  isObjectArray,
  isObject,
  migratingTextIfRenamed,
  sortKeysByFieldType,
} from '../ConfigApiProperties/utils'

type ArrayItemSelectProps = {
  index: number
  values: string[]
  options: MultiSelectOption[]
  label: string
  path: string
  handler: (patch: JsonPatch) => void
  formResetKey: number
}

const AccordionWithSub = Accordion as AccordionWithSubComponents
const AccordionHeader = AccordionWithSub.Header
const AccordionBody = AccordionWithSub.Body

const toPairs = <T,>(items: T[]): Array<[T, T | null]> => {
  const pairs: Array<[T, T | null]> = []
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i], items[i + 1] ?? null])
  }
  return pairs
}

const ArrayItemSelect = React.memo(function ArrayItemSelect({
  index,
  values,
  options,
  label,
  path,
  handler,
  formResetKey,
}: ArrayItemSelectProps) {
  const formikAdapter = useMemo<GluuMultiSelectRowFormik>(
    () => ({
      setFieldValue: (_field: string, newValues: string[]) => {
        handler({ op: 'replace', path, value: newValues })
      },
      setFieldTouched: () => {},
    }),
    [handler, path],
  )

  return (
    <GluuMultiSelectRow
      key={`${path}-${formResetKey}`}
      label={label}
      name={String(index)}
      value={values}
      formik={formikAdapter}
      options={options}
      lsize={12}
      rsize={12}
    />
  )
})

export const NumberField = React.memo(function NumberField({
  propKey,
  value,
  label,
  path,
  handler,
  lSize,
  formResetKey,
  docCategory = 'json_properties',
}: {
  propKey: string
  value: number
  label: string
  path: string
  handler: (patch: JsonPatch) => void
  lSize: number
  formResetKey: number
  docCategory?: string
}) {
  const [localValue, setLocalValue] = useState<number>(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = useCallback(
    (e: { target: { name: string; value: string } }) => {
      const numVal = Number(e.target.value)
      setLocalValue(numVal)
      handler({ op: 'replace', path, value: numVal })
    },
    [handler, path],
  )

  return (
    <GluuInputRow
      key={`${path}-${formResetKey}`}
      name={propKey}
      type="number"
      lsize={lSize}
      rsize={lSize}
      label={label}
      value={localValue}
      doc_category={docCategory}
      doc_entry={propKey}
      handleChange={handleChange}
    />
  )
})

const StringArrayField = React.memo(function StringArrayField({
  propKey,
  label,
  values,
  options,
  path,
  handler,
  lSize,
  formResetKey,
}: StringArrayFieldProps) {
  const formikAdapter = useMemo<GluuMultiSelectRowFormik>(
    () => ({
      setFieldValue: (_field: string, newValues: string[]) => {
        handler({ op: 'replace', path, value: newValues })
      },
      setFieldTouched: () => {},
    }),
    [handler, path],
  )

  return (
    <GluuMultiSelectRow
      key={`${path}-${formResetKey}`}
      label={label}
      name={propKey}
      value={values}
      formik={formikAdapter}
      options={options}
      lsize={lSize}
      rsize={lSize}
    />
  )
})

const JsonPropertyBuilder = ({
  propKey,
  propValue,
  lSize,
  path: initialPath,
  handler,
  parentIsArray = false,
  schema,
  isRenamedKey = false,
  errors,
  touched,
  formResetKey = 0,
}: JsonPropertyBuilderProps): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { classes } = useStyles()
  const [show, setShow] = useState<boolean>(true)

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
        const fallback = migratingTextIfRenamed(isRenamedKey, key)
        i18n.addResource(i18n.language, 'translation', fallbackKey, fallback)
      }
      return fallbackKey
    },
    [i18n, isRenamedKey],
  )

  const path = initialPath ? `${initialPath}/${propKey}` : `/${propKey}`

  const formikPathSegments = useMemo(() => {
    if (!path || path === '/') return [propKey]
    const trimmed = path.replace(/^\//, '')
    if (!trimmed) return [propKey]
    return trimmed.split('/')
  }, [path, propKey])

  const fieldError = useMemo(() => {
    if (!errors) return undefined
    return getIn(errors, formikPathSegments)
  }, [errors, formikPathSegments])

  const fieldTouched = useMemo(() => {
    if (!touched) return false
    return getIn(touched, formikPathSegments) === true
  }, [touched, formikPathSegments])

  const renderError = useCallback(() => {
    if (!fieldTouched) return null
    if (!fieldError) return null

    let errorMessage: string | null = null

    if (Array.isArray(fieldError)) {
      const firstScalar = fieldError.find((item) => typeof item === 'string' && item.trim() !== '')
      errorMessage = firstScalar || null
    } else if (typeof fieldError === 'string') {
      errorMessage = fieldError
    } else if (typeof fieldError === 'object' && fieldError !== null) {
      return null
    } else {
      errorMessage = String(fieldError)
    }

    if (!errorMessage || errorMessage.trim() === '') return null

    return (
      <div className={classes.errorContainer}>
        <FormGroup row className={classes.formGroupNoMargin}>
          <Col sm={10}>
            <FormGroup row className={classes.formGroupNoMargin}>
              <Col sm={lSize}></Col>
              <Col sm={lSize} className={classes.errorCol}>
                <GluuText
                  variant="small"
                  className={`text-danger ${classes.errorText}`}
                  disableThemeColor
                >
                  {errorMessage}
                </GluuText>
              </Col>
            </FormGroup>
          </Col>
        </FormGroup>
      </div>
    )
  }, [fieldTouched, fieldError, lSize, classes])

  const removeHandler = useCallback(() => {
    const patch: JsonPatch = {
      path,
      op: 'remove',
    }
    handler(patch)
    setShow(false)
  }, [path, handler])

  if (isBoolean(propValue) || shouldRenderAsBoolean(schema)) {
    return (
      <>
        <GluuInlineInput
          key={`${path}-${formResetKey}`}
          id={propKey}
          name={propKey}
          lsize={lSize}
          rsize={lSize}
          label={getLocalizedLabelKey(propKey)}
          isBoolean={true}
          handler={handler}
          value={propValue as boolean}
          parentIsArray={parentIsArray}
          path={path}
          showSaveButtons={false}
        />
        {renderError()}
      </>
    )
  }

  if (isString(propValue) || shouldRenderAsString(schema)) {
    return (
      <>
        <GluuInlineInput
          key={`${path}-${formResetKey}`}
          id={propKey}
          name={propKey}
          lsize={lSize}
          rsize={lSize}
          label={getLocalizedLabelKey(propKey)}
          handler={handler}
          value={propValue as string}
          parentIsArray={parentIsArray}
          path={path}
          showSaveButtons={false}
          placeholder={getFieldPlaceholder(t, getLocalizedLabelKey(propKey))}
        />
        {renderError()}
      </>
    )
  }

  if (isNumber(propValue)) {
    return (
      <>
        <NumberField
          propKey={propKey}
          value={propValue as number}
          label={getLocalizedLabelKey(propKey)}
          path={path}
          handler={handler}
          lSize={lSize}
          formResetKey={formResetKey}
        />
        {renderError()}
      </>
    )
  }

  const sortedObjectKeys = useMemo(() => {
    if (!isObject(propValue)) return []
    const objVal = propValue as AppConfiguration
    return sortKeysByFieldType(Object.keys(objVal), objVal as Record<string, PropertyValue>)
  }, [propValue])

  if (isStringArray(propValue) || isEmptyArray(propValue) || shouldRenderAsStringArray(schema)) {
    const arrayValues = (propValue as string[]) || []
    const enumOptions = [...new Set(schema?.items?.enum || arrayValues)]
    const selectOptions: MultiSelectOption[] = enumOptions.map((v: string) => ({
      value: v,
      label: v,
    }))
    return (
      <>
        <StringArrayField
          propKey={propKey}
          label={getLocalizedLabelKey(propKey)}
          values={arrayValues}
          options={selectOptions}
          path={path}
          handler={handler}
          lSize={lSize}
          formResetKey={formResetKey}
        />
        {renderError()}
      </>
    )
  }

  if (isObjectArray(propValue)) {
    const arrayValue = (Array.isArray(propValue) ? propValue : []) as AppConfiguration[]
    const isArrayOfArrays = arrayValue.every((nestedValue) => Array.isArray(nestedValue))

    if (isArrayOfArrays) {
      const stringRows = arrayValue as string[][]
      const allValues = new Set<string>()
      for (const subArray of stringRows) {
        for (const item of subArray) {
          if (item != null) allValues.add(item)
        }
      }
      const multiSelectOptions: MultiSelectOption[] = Array.from(allValues).map((v) => ({
        value: v,
        label: v,
      }))
      const rowItems = stringRows.map((nestedValue, index) => ({ nestedValue, index }))
      const paired = toPairs(rowItems)

      return (
        <Accordion className="mb-2 b-primary" initialOpen>
          <AccordionHeader>
            <GluuText variant="span">{t(getLocalizedLabelKey(propKey))}</GluuText>
          </AccordionHeader>
          <AccordionBody>
            {paired.map(([leftItem, rightItem]) => (
              <FormGroup row key={`pair-${leftItem.index}-${rightItem?.index ?? 'none'}`}>
                <Col sm={6}>
                  <ArrayItemSelect
                    index={leftItem.index}
                    values={leftItem.nestedValue}
                    options={multiSelectOptions}
                    label={getLocalizedLabelKey(String(leftItem.index))}
                    path={`${path}/${leftItem.index}`}
                    handler={handler}
                    formResetKey={formResetKey}
                  />
                </Col>
                <Col sm={6}>
                  {rightItem && (
                    <ArrayItemSelect
                      index={rightItem.index}
                      values={rightItem.nestedValue}
                      options={multiSelectOptions}
                      label={getLocalizedLabelKey(String(rightItem.index))}
                      path={`${path}/${rightItem.index}`}
                      handler={handler}
                      formResetKey={formResetKey}
                    />
                  )}
                </Col>
              </FormGroup>
            ))}
          </AccordionBody>
        </Accordion>
      )
    }

    return (
      <Accordion className="mb-2 b-primary" initialOpen>
        <AccordionHeader>
          <div className={classes.accordionHeaderRow}>
            <GluuText variant="span">{t(getLocalizedLabelKey(propKey))}</GluuText>
          </div>
        </AccordionHeader>
        <AccordionBody>
          {arrayValue.length === 0 ? (
            <GluuText variant="span">{t('messages.no_data_available')}</GluuText>
          ) : (
            arrayValue.map((nestedValue, index) => (
              <JsonPropertyBuilder
                key={String(index)}
                propKey={String(index)}
                propValue={nestedValue}
                handler={handler}
                lSize={lSize}
                parentIsArray={true}
                path={path}
                errors={errors}
                touched={touched}
                formResetKey={formResetKey}
              />
            ))
          )}
        </AccordionBody>
      </Accordion>
    )
  }

  if (isObject(propValue)) {
    const objectValue = propValue as AppConfiguration
    return (
      <div>
        {show && (
          <Accordion className="mb-2 b-primary" initialOpen>
            <AccordionHeader>
              <div className={classes.accordionHeaderRow}>
                <GluuText variant="span">{t(getLocalizedLabelKey(propKey))}</GluuText>
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
                  >
                    <i className={`fa fa-remove ${classes.removeButtonIcon}`} aria-hidden />
                    {t('actions.remove')}
                  </GluuButton>
                )}
              </div>
            </AccordionHeader>
            <AccordionBody>
              {Object.keys(objectValue).length === 0 ? (
                <GluuText variant="span">{t('messages.no_data_available')}</GluuText>
              ) : (
                <div className={classes.objectFieldsGrid}>
                  {sortedObjectKeys.map((objKey) => {
                    const nestedValue = objectValue[objKey]
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
                        <JsonPropertyBuilder
                          propKey={objKey}
                          propValue={nestedValue}
                          handler={handler}
                          lSize={12}
                          parentIsArray={false}
                          path={path}
                          errors={errors}
                          touched={touched}
                          formResetKey={formResetKey}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </AccordionBody>
          </Accordion>
        )}
      </div>
    )
  }

  return <></>
}

export default React.memo(JsonPropertyBuilder)
