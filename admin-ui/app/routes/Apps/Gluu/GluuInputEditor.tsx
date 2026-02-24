import React from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from '../Gluu/GluuLabel'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import { useStyles } from './styles/GluuInputEditor.style'
import type { GluuInputEditorProps } from './types/GluuInputEditor.types'

const GluuInputEditor = <T extends object>({
  name,
  language,
  value,
  formik,
  required = false,
  lsize = 3,
  rsize = 9,
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
  width = '100%',
  isDark,
}: GluuInputEditorProps<T>): React.ReactElement => {
  const { classes } = useStyles()

  const handleChange = (scripts: string) => {
    formik.setFieldValue(name, scripts)
  }

  return (
    <FormGroup row>
      <GluuLabel
        doc_category={doc_category}
        doc_entry={doc_entry ?? name}
        label={label}
        size={lsize}
        required={required}
        isDark={isDark}
      />
      <Col sm={rsize} className={classes.colWrapper}>
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
          height="300px"
          onChange={handleChange}
          name={name}
          value={value ?? ''}
          editorProps={{ $blockScrolling: true }}
        />
        {showError && errorMessage ? <div className={classes.error}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

export default GluuInputEditor
