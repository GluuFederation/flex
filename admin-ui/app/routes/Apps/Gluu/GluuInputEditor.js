import React from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from '../Gluu/GluuLabel'
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/theme-xcode"
import "ace-builds/src-noconflict/ext-language_tools"

function GluuInputEditor({
  name,
  language,
  value,
  formik,
  required,
  lsize,
  rsize,
  doc_category,
}) {
  return (
    <FormGroup row>
      <GluuLabel
        doc_category={doc_category}
        doc_entry={name}
        label={name}
        size={lsize}
        required={required}
      />
      {formik.errors.script && formik.touched.script ? (
        <div style={{ color: 'red' }}>{formik.errors.script}</div>
      ) : null}
      <Col sm={rsize}>
        <AceEditor
          mode={language}
          theme="xcode"
          placeholder="Write your custom script here"
          fontSize={16}
          width="95%"
          height="300px"
          onChange={() => {
            formik.onChange
          }}
          name={name}
          defaultValue={value}
          editorProps={{ $blockScrolling: true }}
        />
      </Col>
    </FormGroup>
  )
}

export default GluuInputEditor
