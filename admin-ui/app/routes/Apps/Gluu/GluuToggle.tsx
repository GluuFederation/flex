import { useState } from 'react'
import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import type { JsonValue } from './types/common'
import type { GluuToggleProps } from './types/GluuToggle.types'
import { useStyles } from './styles/GluuToggle.style'

const GluuToggle = <T = Record<string, JsonValue>,>({
  id,
  name,
  formik,
  value = false,
  handler,
  disabled = false,
}: GluuToggleProps<T>) => {
  const { classes } = useStyles()
  const [focused, setFocused] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (formik) {
      formik.handleChange(event)
    }
    handler?.(event)
  }

  return (
    <span className={classes.wrapper}>
      <label
        className={clsx(
          classes.root,
          'react-toggle',
          value && 'react-toggle--checked',
          disabled && 'react-toggle--disabled',
          focused && 'react-toggle--focus',
        )}
      >
        <div className="react-toggle-track">
          <div className="react-toggle-track-check">
            <svg width="14" height="11" viewBox="0 0 14 11">
              <path
                d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0"
                fill="#fff"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="react-toggle-track-x">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12"
                fill="#fff"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="react-toggle-thumb" />
        </div>
        <input
          id={id}
          name={name}
          data-testid={name}
          type="checkbox"
          className="react-toggle-screenreader-only"
          checked={value}
          disabled={disabled}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </label>
    </span>
  )
}

export default GluuToggle
