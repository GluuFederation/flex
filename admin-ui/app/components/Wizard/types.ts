import type { ReactNode } from 'react'

export type WizardStepProps = {
  'active'?: boolean
  'complete'?: boolean
  'disabled'?: boolean
  'className'?: string
  'id': string
  'onClick': () => void
  'icon'?: ReactNode
  'successIcon'?: ReactNode
  'children'?: ReactNode
  'data-testid'?: string
}
