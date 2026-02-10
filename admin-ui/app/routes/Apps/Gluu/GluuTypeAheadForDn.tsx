import { useCallback, useState } from 'react'
import { FormGroup, Col } from 'Components'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import type { FormikProps } from 'formik'

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
})

type TypeAheadOptionObject = {
  dn?: string
  key?: string
  name?: string
  customOption?: boolean
  label?: string
}

type TypeAheadOption = string | TypeAheadOptionObject

interface GluuTypeAheadForDnProps<
  TValues extends Record<string, unknown> = Record<string, unknown>,
  TOption extends TypeAheadOptionObject = TypeAheadOptionObject,
> {
  label: string
  name: string
  value?: TOption[]
  options: TOption[]
  formik: FormikProps<TValues>
  required?: boolean
  doc_category?: string
  doc_entry?: string
  disabled?: boolean
  allowNew?: boolean
  haveLabelKey?: boolean
  lsize?: number
  rsize?: number
  paginate?: boolean
  onSearch?: (query: string) => void
  onPaginate?: (e: unknown, shownResults: number) => void
  maxResults?: number
  isLoading?: boolean
  placeholder?: string
  onChange?: (selected: TOption[]) => void
  hideHelperMessage?: boolean
  defaultSelected?: TOption[]
}

function GluuTypeAheadForDn<
  TValues extends Record<string, unknown> = Record<string, unknown>,
  TOption extends TypeAheadOptionObject = TypeAheadOptionObject,
>({
  label,
  name,
  value: _value,
  options,
  formik,
  required,
  doc_category,
  doc_entry,
  disabled = false,
  allowNew = false,
  haveLabelKey = true,
  lsize = 4,
  rsize = 8,
  paginate = false,
  onSearch = () => {},
  onPaginate = () => {},
  maxResults = undefined,
  isLoading = false,
  placeholder = undefined,
  onChange,
  hideHelperMessage,
  defaultSelected,
}: GluuTypeAheadForDnProps<TValues, TOption>) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const selectedValue = defaultSelected ?? _value ?? []

  const getItemName = useCallback(
    (item: string) => {
      const data = options?.filter(
        (e) => e.dn === item || (typeof e.key === 'string' && item.includes(e.key)),
      )
      return data[0]?.name
    },
    [options],
  )

  const getKey = useCallback((option: TypeAheadOptionObject) => {
    return option.key ? `(Claim name: ${option.key})` : ''
  }, [])

  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        required={required}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
      />
      <Col sm={rsize}>
        <AsyncTypeahead
          isLoading={isLoading}
          labelKey={
            haveLabelKey
              ? (opt: TypeAheadOption) =>
                  typeof opt === 'string'
                    ? opt
                    : `${opt.name || (opt.key ? getItemName(opt.key) : '')} ${getKey(opt)}`
              : undefined
          }
          maxResults={maxResults}
          options={options as unknown as TypeAheadOption[]}
          onPaginate={onPaginate}
          paginate={paginate}
          placeholder={placeholder}
          renderMenuItemChildren={(option: TypeAheadOption) => {
            if (typeof option === 'string') {
              return (
                <div key={option}>
                  <span>{option}</span>
                </div>
              )
            }
            return (
              <div key={option.name ?? option.dn ?? option.key ?? option.label}>
                <span>{option.name ?? option.label ?? ''}</span>
              </div>
            )
          }}
          open={open}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onChange={(selected) => {
            formik.setFieldValue(
              name,
              (selected as TypeAheadOption[]).map((item) =>
                typeof item === 'string' ? item : item.customOption ? item.label : item.dn,
              ),
            )
            const selectedOptions = (selected as TypeAheadOption[]).filter(
              (item): item is TOption => typeof item !== 'string',
            )
            onChange?.(selectedOptions)
          }}
          disabled={disabled}
          id={name}
          data-testid={name}
          useCache={false}
          allowNew={allowNew}
          multiple={true}
          selected={selectedValue as unknown as TypeAheadOption[]}
          onSearch={onSearch}
          dropup={false}
          flip={true}
          positionFixed={true}
        />
        {!hideHelperMessage && (
          <ThemeProvider theme={theme}>
            <Typography variant="subtitle1">
              {t('placeholders.typeahead_holder_message')}
            </Typography>
          </ThemeProvider>
        )}
      </Col>
    </FormGroup>
  )
}

export default GluuTypeAheadForDn
