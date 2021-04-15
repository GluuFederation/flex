import React from 'react'
import {
  Input,
  InputGroup,
  CustomInput,
  FormGroup,
} from './../../../components'

function GluuCustomScriptSearch({
  handler,
  patternId,
  limitId,
  statusId,
  typeId,
  limit,
}) {
  return (
    <FormGroup row style={{ marginTop: '10px' }}>
      <Input
        style={{ width: '80px' }}
        id={limitId}
        type="number"
        defaultValue={limit}
        onChange={handler}
      />
      &nbsp;
      <InputGroup style={{ width: '210px' }}>
        <CustomInput type="select" id={typeId} onChange={handler}>
          <option value="">ALL</option>
          <option>PERSON_AUTHENTICATION</option>
          <option></option>
        </CustomInput>
      </InputGroup>
      &nbsp;
      <InputGroup style={{ width: '110px' }}>
        <CustomInput
          type="select"
          placeholder="Status"
          id={statusId}
          onChange={handler}
        >
          <option value="">Choose status</option>
          <option>true</option>
          <option>false</option>
        </CustomInput>
      </InputGroup>
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

export default GluuCustomScriptSearch
