import React from 'react'
import { Input, FormGroup } from './../../../components'

function GluuAdvancedSearch({ handler }) {
  return (
    <FormGroup row style={{marginTop:"10px"}}>
      <Input
        style={{ width: '100px' }}
        id="searchLimit"
        type="number"
        defaultValue={100}
        onChange={handler}
      />
      &nbsp;
      <Input
        style={{ width: '200px' }}
        id="searchPattern"
        type="text"
        placeholder="search pattern"
        defaultValue=""
        onChange={handler}
      />
    </FormGroup>
  )
}

export default GluuAdvancedSearch
