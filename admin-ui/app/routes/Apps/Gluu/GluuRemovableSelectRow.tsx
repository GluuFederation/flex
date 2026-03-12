import GluuLabel from './GluuLabel'
import { CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuTooltip from './GluuTooltip'
import { FormikProps } from 'formik'
import React, { useMemo } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'

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
  hideRemoveButton?: boolean
  modifiedFields: Record<string, ModifiedFieldValue>
  setModifiedFields: React.Dispatch<React.SetStateAction<Record<string, ModifiedFieldValue>>>
}

function GluuRemovableSelectRow({
  label,
  name,
  value,
  formik,
  values = [],
  lsize = 12,
  rsize = 12,
  handler,
  doc_category,
  isDirect,
  hideRemoveButton,
  modifiedFields,
  setModifiedFields,
}: GluuRemovableSelectRowProps) {
  const currentValue = (formik.values[name] as string | undefined) ?? value ?? ''

  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={name}>
      <div>
        <GluuLabel label={label} size={lsize} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <InputGroup style={{ flex: 1, minWidth: 0 }}>
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
          {!hideRemoveButton && (
            <button
              type="button"
              aria-label={t('actions.remove')}
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                padding: 6,
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              onClick={() => handler()}
            >
              <i
                className={'fa fa-fw fa-close'}
                style={{ color: themeColors.fontColor, fontSize: 16 }}
              />
            </button>
          )}
        </div>
      </div>
    </GluuTooltip>
  )
}
export default GluuRemovableSelectRow
