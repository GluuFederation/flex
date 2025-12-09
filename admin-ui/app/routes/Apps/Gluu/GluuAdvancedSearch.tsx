import React from 'react'
import { Input, FormGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import type { GluuAdvancedSearchProps } from './types'

function GluuAdvancedSearch({
  handler,
  onChange,
  onKeyDown,
  patternId,
  limitId,
  limit,
  pattern = '',
  showLimit = true,
  controlled = false,
}: GluuAdvancedSearchProps) {
  const { t } = useTranslation()

  const handleChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined = onChange
    ? onChange
    : handler
      ? (event: React.ChangeEvent<HTMLInputElement>) => {
          handler(event)
        }
      : undefined

  const handleKeyDown: ((event: React.KeyboardEvent<HTMLInputElement>) => void) | undefined =
    onKeyDown
      ? onKeyDown
      : handler
        ? (event: React.KeyboardEvent<HTMLInputElement>) => {
            handler(event)
          }
        : undefined

  const patternProps = controlled ? { value: pattern || '' } : { defaultValue: pattern }

  return (
    <FormGroup row style={{ marginTop: '10px' }}>
      {showLimit && (
        <Input
          style={{ width: '100px' }}
          id={limitId}
          type="number"
          name="limit"
          data-testid={limitId}
          defaultValue={limit}
          onChange={handleChange}
          onKeyDown={(evt) => evt.key === 'e' && evt.preventDefault()}
        />
      )}
      &nbsp;
      <Input
        style={{ width: '180px', height: '54px' }}
        id={patternId}
        data-testid={patternId}
        type="text"
        name="pattern"
        {...patternProps}
        placeholder={t('placeholders.search_pattern')}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </FormGroup>
  )
}

export default GluuAdvancedSearch
