import React from 'react'
import { Input, FormGroup } from './../../../components'

function GluuAdvancedSearch({ handler, patternId, limitId, limit }) {
  return (
    <FormGroup row style={{ marginTop: '10px' }}>
      <Input
        style={{ width: '100px' }}
        id={limitId}
        type="number"
        defaultValue={limit}
        onChange={handler}
      />
      &nbsp;
      <Input
        style={{ width: '180px' }}
        id={patternId}
        type="text"
        placeholder="search pattern"
        onChange={handler}
      />
    </FormGroup>
  )
}

export default GluuAdvancedSearch
