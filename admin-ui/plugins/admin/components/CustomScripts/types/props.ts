import type { FormikProps } from 'formik'
import type { Action } from '@material-table/core'
import type {
  CustomScript,
  ScriptTypeOption,
  ScriptListFilters,
  PaginationOptions,
  FormMode,
} from './domain'
import type { ScriptFormValues } from './form'

export interface ScriptListPageProps {
  initialType?: string
}

export interface ScriptAddPageProps {
  onSuccess?: (script: CustomScript) => void
}

export interface ScriptEditPageProps {
  id?: string
  viewOnly?: boolean
  onSuccess?: (script: CustomScript) => void
}

export interface ScriptFormProps {
  item: CustomScript
  handleSubmit: (data: { customScript: CustomScript & { action_message?: string } }) => void
  viewOnly?: boolean
  mode: FormMode
}

export interface BasicInfoFieldsProps {
  formik: FormikProps<ScriptFormValues>
  scriptTypes: ScriptTypeOption[]
  disabled?: boolean
  loadingScriptTypes?: boolean
}

export interface ScriptTypeFieldsProps {
  formik: FormikProps<ScriptFormValues>
  scriptType: string
  disabled?: boolean
}

export interface LocationFieldsProps {
  formik: FormikProps<ScriptFormValues>
  locationType: string
  onLocationTypeChange: (type: 'db' | 'file') => void
  disabled?: boolean
}

export interface PropertiesSectionProps {
  formik: FormikProps<ScriptFormValues>
  disabled?: boolean
  onUpdateModuleProperty: (key: string, value: string) => void
  onRemoveModuleProperty: (key: string) => void
}

export interface ScriptErrorAlertProps {
  error?: {
    raisedAt?: string
    stackTrace?: string
  }
}

export interface ScriptListTableProps {
  scripts: CustomScript[]
  totalItems: number
  loading: boolean
  pageNumber: number
  limit: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (count: number) => void
  actions: Array<Action<CustomScript>>
  theme: string
}

export interface ScriptListFiltersProps {
  filters: ScriptListFilters
  scriptTypes: ScriptTypeOption[]
  onFilterChange: (filters: Partial<ScriptListFilters>) => void
  onClearFilters: () => void
  onRefresh: () => void
  loadingScriptTypes?: boolean
}

export interface ScriptListActionsProps {
  script: CustomScript
  permissions: {
    canRead: boolean
    canWrite: boolean
    canDelete: boolean
  }
  onEdit: (script: CustomScript) => void
  onView: (script: CustomScript) => void
  onDelete: (script: CustomScript) => void
}

export interface ScriptDetailPanelProps {
  row: CustomScript
}

export interface PropertyEditorProps {
  properties: Array<{ value1?: string; value2?: string; description?: string; hide?: boolean }>
  onChange: (
    properties: Array<{ value1?: string; value2?: string; description?: string; hide?: boolean }>,
  ) => void
  disabled?: boolean
  extended?: boolean
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export interface ScriptTypeSelectProps {
  value: string
  options: ScriptTypeOption[]
  onChange: (value: string) => void
  disabled?: boolean
  loading?: boolean
  error?: string
  label?: string
}
