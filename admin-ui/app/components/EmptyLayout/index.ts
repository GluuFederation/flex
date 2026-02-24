import type React from 'react'
import { EmptyLayout } from './EmptyLayout'
import { EmptyLayoutSection } from './EmptyLayoutSection'
;(EmptyLayout as React.ComponentType & { Section: typeof EmptyLayoutSection }).Section =
  EmptyLayoutSection

export { EmptyLayoutSection }
export default EmptyLayout
