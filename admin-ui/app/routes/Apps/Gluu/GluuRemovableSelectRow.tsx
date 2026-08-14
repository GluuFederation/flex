import GluuLabel from './GluuLabel'
import { CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'
import { Close } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './styles/GluuRemovableSelectRow.style'
import type { GluuRemovableSelectRowProps } from './types'

const GluuRemovableSelectRow = ({
  label,
  name,
  value,
  formik,
  values = [],
  lsize = 12,
  handler,
  doc_category,
  isDirect,
  hideRemoveButton,
  modifiedFields,
  setModifiedFields,
}: GluuRemovableSelectRowProps) => {
  const currentValue = (formik.values[name] as string | undefined) ?? value ?? ''

  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const { classes } = useStyles()

  return (
    <div>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={name}
        isDirect={isDirect}
      />
      <div className={classes.row}>
        <InputGroup style={{ flex: 1, minWidth: 0 }}>
          <CustomInput
            type="select"
            id={name}
            data-testid={name}
            name={name}
            value={currentValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setModifiedFields?.({
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
            className={classes.removeButton}
            onClick={() => handler()}
          >
            <Close sx={{ color: themeColors.fontColor, fontSize: 16 }} />
          </button>
        )}
      </div>
    </div>
  )
}
export default GluuRemovableSelectRow
