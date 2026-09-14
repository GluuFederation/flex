import React, { lazy, Suspense } from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from '../Gluu/GluuLabel'
import { useStyles } from './styles/GluuInputEditor.style'
import type { GluuInputEditorProps } from './types/GluuInputEditor.types'

const GluuAceEditor = lazy(() => import('./GluuAceEditor'))

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
  theme,
  placeholder = 'Write your custom script here',
  doc_entry,
  shortcode,
  onCursorChange,
  width = '100%',
  isDark,
}: GluuInputEditorProps<T>): React.ReactElement => {
  const { classes } = useStyles()
  const aceTheme = theme ?? (isDark ? 'monokai' : 'xcode')

  const handleChange = (scripts: string) => {
    if (!readOnly) {
      formik.setFieldValue(name, scripts)
    }
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
        <Suspense
          fallback={
            <div className={classes.editorPlaceholder} style={{ width }} aria-busy="true" />
          }
        >
          <GluuAceEditor
            name={name}
            language={language}
            value={value}
            readOnly={readOnly}
            theme={aceTheme}
            placeholder={placeholder}
            onCursorChange={onCursorChange}
            width={width}
            onChange={handleChange}
          />
        </Suspense>
        {showError && errorMessage ? <div className={classes.error}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

export default GluuInputEditor
