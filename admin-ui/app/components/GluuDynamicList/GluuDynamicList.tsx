import React, { useMemo } from 'react'
import { Input } from 'reactstrap'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useTheme } from '@/context/theme/themeContext'
import { GluuButton } from '../GluuButton'
import { useStyles } from './GluuDynamicList.style'
import type { GluuDynamicListProps } from './types'

const joinClasses = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ')

export const GluuDynamicList: React.FC<GluuDynamicListProps> = ({
  title,
  label,
  items,
  mode = 'pair',
  disabled = false,
  keyPlaceholder,
  valuePlaceholder,
  addButtonLabel,
  removeButtonLabel,
  onAdd,
  onRemove,
  onChange,
  showError = false,
  errorMessage,
  getItemKey,
  className,
  style,
}) => {
  const { state } = useTheme()
  const selectedTheme = state?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
  const isEmpty = items.length === 0

  return (
    <div className={joinClasses(classes.wrapper, className)} style={style}>
      {label && <label className={classes.outerLabel}>{label}</label>}
      <div className={joinClasses(classes.box, isEmpty && classes.boxEmpty)}>
        <div
          className={joinClasses(classes.header, isEmpty && classes.headerEmpty)}
          style={label ? { justifyContent: 'flex-end' } : undefined}
        >
          {!label && (
            <GluuText variant="h5" disableThemeColor>
              <span className={classes.title}>{title}</span>
            </GluuText>
          )}
          <GluuButton
            type="button"
            disabled={disabled}
            backgroundColor={themeColors.settings.addPropertyButton.bg}
            textColor={themeColors.settings.addPropertyButton.text}
            useOpacityOnHover
            className={classes.headerActionBtn}
            style={{ outline: 'none', boxShadow: 'none' }}
            onClick={onAdd}
          >
            <i className="fa fa-fw fa-plus" />
            {addButtonLabel}
          </GluuButton>
        </div>

        <div className={classes.body}>
          {items.map((item, index) => (
            <div
              key={getItemKey ? getItemKey(item, index) : (item.id ?? index)}
              className={joinClasses(classes.row, mode === 'single' && classes.singleRow)}
            >
              {mode === 'pair' && (
                <Input
                  value={item.key ?? ''}
                  disabled={disabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(index, 'key', event.target.value)
                  }
                  placeholder={keyPlaceholder}
                  className={joinClasses(classes.input, 'gluu-dynamic-list-input')}
                />
              )}

              <Input
                value={item.value ?? ''}
                disabled={disabled}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(index, 'value', event.target.value)
                }
                placeholder={valuePlaceholder}
                className={joinClasses(
                  classes.input,
                  mode === 'single' && classes.singleInput,
                  'gluu-dynamic-list-input',
                )}
              />

              <GluuButton
                type="button"
                disabled={disabled}
                backgroundColor={themeColors.settings.removeButton.bg}
                textColor={themeColors.settings.removeButton.text}
                useOpacityOnHover
                className={classes.actionBtn}
                onClick={() => onRemove(index)}
              >
                <i className="fa fa-fw fa-trash" />
                {removeButtonLabel}
              </GluuButton>
            </div>
          ))}
        </div>

        {showError && errorMessage?.trim() && <div className={classes.error}>{errorMessage}</div>}
      </div>
    </div>
  )
}

export default GluuDynamicList
