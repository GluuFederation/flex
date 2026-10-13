import React, { useCallback, useMemo } from 'react'
import { getIn } from 'formik'
import { useTranslation } from 'react-i18next'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import { Add as AddIcon, Delete as DeleteIcon } from '@/components/icons'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import JansLockFieldRenderer from './JansLockFieldRenderer'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { JansLockListEditorProps } from '../types'

const JansLockListEditor: React.FC<JansLockListEditorProps> = ({
  config,
  formik,
  classes,
  viewOnly,
}) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state?.theme ?? DEFAULT_THEME), [state?.theme])
  const { name, title, addLabel, emptyText, fields, newItem } = config
  const { setFieldValue } = formik

  const items = useMemo(() => {
    const value: JsonValue | undefined = getIn(formik.values, name)
    return Array.isArray(value) ? value : []
  }, [formik.values, name])

  const handleAdd = useCallback(() => {
    setFieldValue(name, [...items, { ...newItem }])
  }, [setFieldValue, name, items, newItem])

  const handleRemove = useCallback(
    (index: number) => () => {
      setFieldValue(
        name,
        items.filter((_, itemIndex) => itemIndex !== index),
      )
    },
    [setFieldValue, name, items],
  )

  const isEmpty = items.length === 0

  return (
    <div className={`${classes.listBox} ${isEmpty ? classes.listBoxEmpty : ''}`.trim()}>
      <div className={classes.listHeader}>
        <GluuText variant="h5" disableThemeColor>
          <span className={classes.listTitle}>{t(title)}</span>
        </GluuText>
        {!viewOnly && (
          <GluuButton
            type="button"
            backgroundColor={themeColors.settings.addPropertyButton.bg}
            textColor={themeColors.settings.addPropertyButton.text}
            useOpacityOnHover
            className={classes.listActionBtn}
            onClick={handleAdd}
          >
            <AddIcon className={classes.listActionIcon} />
            {t(addLabel)}
          </GluuButton>
        )}
      </div>
      <div className={classes.listBody}>
        {isEmpty && (
          <GluuText variant="span" className={classes.listEmpty} disableThemeColor>
            {t(emptyText)}
          </GluuText>
        )}
        {items.map((_, index) => (
          <div key={`${name}.${index}`} className={classes.listRow}>
            <div
              className={`${classes.listRowFields} ${classes.formLabels} ${classes.formWithInputs}`}
            >
              {fields.map((field) => (
                <JansLockFieldRenderer
                  key={field.name}
                  config={{ ...field, name: `${name}.${index}.${field.name}` }}
                  formik={formik}
                  fieldItemClass={classes.fieldItem}
                  fieldItemFullWidthClass={classes.fieldItemFullWidth}
                  viewOnly={viewOnly}
                />
              ))}
            </div>
            {!viewOnly && (
              <GluuButton
                type="button"
                backgroundColor={themeColors.settings.removeButton.bg}
                textColor={themeColors.settings.removeButton.text}
                useOpacityOnHover
                className={classes.listActionBtn}
                onClick={handleRemove(index)}
              >
                <DeleteIcon className={classes.listActionIcon} />
                {t('actions.remove')}
              </GluuButton>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(JansLockListEditor)
