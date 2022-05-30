import React from 'react'
import { Col, FormGroup, Input } from 'Components'
import GluuTooltip from '../Gluu/GluuTooltip'
import GluuLabel from '../Gluu/GluuLabel'
import AceEditor from 'react-ace'

function GluuInputEditor({
  label,
  name,
  value,
  formik,
  required,
  lsize,
  rsize,
  doc_category,
}) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        {formik.errors.script && formik.touched.script ? (
          <div style={{ color: 'red' }}>{formik.errors.script}</div>
        ) : null}
        <Col sm={rsize}>
          <AceEditor
            mode="python"
            theme="xcode"
            placeholder="Write your custom script here"
            fontSize={20}
            width='95%'
            height='400px'
            onChange={() => {}}
            name={name}
            defaultValue={value}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 4,
                }}
          />
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default GluuInputEditor
