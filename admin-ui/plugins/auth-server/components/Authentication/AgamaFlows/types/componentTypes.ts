import type { Deployment } from 'JansConfigApi'
import type { AgamaProject } from './agamaTypes'

export type AgamaProjectConfigModalProps = {
  isOpen: boolean
  row: AgamaProject
  handler: () => void
  handleUpdateRowData: (updatedData: Deployment) => void
  manageConfig?: boolean
}
