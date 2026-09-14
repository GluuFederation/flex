import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import type { GluuAceEditorProps } from './types/GluuInputEditor.types'

const GluuAceEditor = ({
  name,
  language,
  value,
  readOnly = false,
  theme,
  placeholder,
  onCursorChange,
  width = '100%',
  onChange,
}: GluuAceEditorProps): React.ReactElement => (
  <AceEditor
    mode={language}
    readOnly={readOnly}
    wrapEnabled
    setOptions={{ useWorker: false, hScrollBarAlwaysVisible: false }}
    theme={theme}
    placeholder={placeholder}
    fontSize={16}
    onCursorChange={onCursorChange}
    width={width}
    height="300px"
    onChange={onChange}
    name={name}
    value={value ?? ''}
    editorProps={{ $blockScrolling: true }}
    highlightActiveLine={!readOnly}
  />
)

export default GluuAceEditor
