import React from 'react'
import { Input, FormGroup } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuAdvancedSearch({
  handler,
  patternId,
  limitId,
  limit,
  pattern = '',
}) {
  const { t } = useTranslation()
  return (
    <FormGroup row style={{ marginTop: '10px' }}>
      <Input
        style={{ width: '100px' }}
        id={limitId}
        type="number"
        name="limit"
        data-testid={limitId}
        defaultValue={limit}
        onChange={handler}
      />
      &nbsp;
      <Input
        style={{ width: '180px' }}
        id={patternId}
        data-testid={patternId}
        type="text"
        name="pattern"
        defaultValue={pattern}
        placeholder={t('placeholders.search_pattern')}
        onChange={handler}
      />
    </FormGroup>
  )
}

export default GluuAdvancedSearch
