import type { ReactElement } from 'react'
import Acrs from '../Acrs/Acrs'

// Built-In tab — renders the ACR list filtered to built-in (system) authentication methods.
const BuiltIn = (): ReactElement => <Acrs isBuiltIn={true} />

export default BuiltIn
