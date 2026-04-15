import type { Deployment } from 'JansConfigApi'
import type { AgamaProject } from './agamaTypes'

/**
 * Props for AgamaAliasListPage component
 * This is a route-level component with no props
 */
export type AgamaAliasListPageProps = Record<string, never>

/**
 * Props for AgamaListPage component
 * This is a route-level component with no props
 */
export type AgamaListPageProps = Record<string, never>

/**
 * Props for AgamaProjectConfigModal component
 */
export interface AgamaProjectConfigModalProps {
  /** Controls modal visibility */
  isOpen: boolean
  /** Project row data from table */
  row: AgamaProject
  /** Handler to close the modal */
  handler: () => void
  /** Callback to update parent row data after changes */
  handleUpdateRowData: (updatedData: Deployment) => void
  /** Optional flag to show config management interface */
  manageConfig?: boolean
}
