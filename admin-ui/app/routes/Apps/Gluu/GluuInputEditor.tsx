// @ts-nocheck
import React from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from '../Gluu/GluuLabel'
import AceEditor from 'react-ace'
import PropTypes from 'prop-types'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'

function GluuInputEditor({
  name,
  language,
  value,
  formik,
  required,
  lsize,
  rsize,
  doc_category,
  readOnly = false,
  label,
  showError = false,
  errorMessage,
  theme = 'xcode',
  placeholder = 'Write your custom script here',
  doc_entry,
  shortcode,
  onCursorChange,
  width = '100%'
}) {
  const handleChange = (scripts) => {
    formik.handleChange(name)(scripts)
  }

  return (
    <FormGroup row>
      <GluuLabel
        doc_category={doc_category}
        doc_entry={doc_entry || name}
        label={label}
        size={lsize}
        required={required}
      />
      <Col sm={rsize} style={{ position: 'relative' }}>
        {shortcode}
        <AceEditor
          mode={language}
          readOnly={readOnly}
          setOptions={{ useWorker: false }}
          theme={theme}
          placeholder={placeholder}
          fontSize={16}
          onCursorChange={onCursorChange}
          width={width}
          height='300px'
          onChange={(e) => handleChange(e)}
          name={name}
          value={value}
          editorProps={{ $blockScrolling: true }}
        />
        {showError ? <div style={{ color: "red" }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

export default GluuInputEditor
GluuInputEditor.propTypes = {
  errorMessage: PropTypes.string,
  theme: PropTypes.string,
  placeholder: PropTypes.string,
  showError: PropTypes.bool,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  doc_category: PropTypes.string,
  rsize: PropTypes.number,
  lsize: PropTypes.number,
  required: PropTypes.bool,
  formik: PropTypes.any,
  value: PropTypes.any,
  language: PropTypes.string,
  name: PropTypes.string,
  doc_entry: PropTypes.string,
  shortcode: PropTypes.element,
  onCursorChange: PropTypes.func,
  width: PropTypes.string
}
