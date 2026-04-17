import React, { useState, useEffect, useMemo, type ReactElement } from 'react'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import type { SelectOption } from 'Routes/Apps/Gluu/types/GluuSelectRow.types'
import type { DefaultAcrInputProps } from '../types'

const DefaultAcrInput = ({
  label,
  name,
  value,
  required = false,
  lsize = 3,
  rsize = 9,
  handler,
  options,
  path,
}: DefaultAcrInputProps): ReactElement => {
  const [data, setData] = useState<string>(value ?? '')

  useEffect(() => {
    setData(value ?? '')
  }, [value])

  const selectOptions = useMemo<SelectOption[]>(
    () =>
      options.map((item) =>
        typeof item === 'object'
          ? { value: item.value, label: item.label }
          : { value: item, label: item },
      ),
    [options],
  )

  const formikAdapter = useMemo(
    () => ({
      handleChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const newValue = e.target.value
        setData(newValue)
        if (newValue) {
          handler({
            path,
            value: newValue,
            op: 'replace',
          })
        }
      },
      handleBlur: () => {},
    }),
    [handler, path],
  )

  return (
    <GluuSelectRow
      label={label}
      name={name}
      value={data}
      formik={formikAdapter}
      values={selectOptions}
      lsize={lsize}
      rsize={rsize}
      required={required}
      doc_category="json_properties"
      doc_entry={name}
    />
  )
}

export default React.memo(DefaultAcrInput)
