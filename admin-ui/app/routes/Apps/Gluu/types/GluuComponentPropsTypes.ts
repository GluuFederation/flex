import type { CSSProperties, ReactNode, HTMLAttributes } from 'react'
import type { AlertProps } from '@mui/material/Alert'
import type { FormikProps } from 'formik'
import type { Accept } from 'react-dropzone'
import type { JsonPatch } from 'JansConfigApi'
import type { JsonValue, JsonObject } from './common'

export type GluuAlertProps = {
  severity?: AlertProps['severity']
  message?: string
  show?: boolean
}

export type GluuBooleanSelectBoxProps = {
  label: string
  name: string
  value?: boolean | string
  formik: FormikProps<Record<string, JsonValue>>
  handler?: () => void
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  toToggle?: boolean
}

export type GluuCommitFooterProps = {
  extraOnClick?: () => void
  saveHandler?: () => void
  extraLabel?: string
  hideButtons?: {
    save?: boolean
    back?: boolean
  }
  disableButtons?: {
    save?: boolean
    back?: boolean
  }
  type?: 'button' | 'submit'
  disableBackButton?: boolean
  cancelHandler?: () => void
  backButtonLabel?: string
  backButtonHandler?: () => void
}

export type DialogRow = {
  name?: string
  inum?: string
  id?: string
}

export type GluuDialogProps = {
  row: DialogRow
  handler: () => void
  modal: boolean
  onAccept: (message: string) => void
  subject: string
  name?: string
  feature: string
}

export type GluuFormActionRowProps = {
  label: string
  value?: JsonValue
  lsize?: number
  rsize?: number
  doc_category?: string
  doc_entry?: string
  isDirect?: boolean
  onActionClick?: (value: JsonValue) => void
}

export type GluuFormDetailRowProps = {
  label: string
  value?: string | number | boolean | null
  isBadge?: boolean
  badgeColor?: string
  badgeBackgroundColor?: string
  badgeTextColor?: string
  lsize?: number
  rsize?: number
  doc_category?: string
  doc_entry?: string
  isDirect?: boolean
  labelStyle?: CSSProperties
  valueStyle?: CSSProperties
  rowClassName?: string
  layout?: 'row' | 'column'
}

export type ButtonLabelProps = {
  isLoading: boolean
  iconClass: string
  label: string
  loadingIconClass?: string
}

export type GluuFormFooterBaseProps = {
  showBack?: boolean
  backButtonLabel?: string
  onBack?: () => void
  disableBack?: boolean
  backIconClass?: string
  showCancel?: boolean
  cancelButtonLabel?: string
  onCancel?: () => void
  disableCancel?: boolean
  cancelButtonStyle?: CSSProperties
  cancelButtonClassName?: string
  cancelIconClass?: string
  showApply?: boolean
  disableApply?: boolean
  applyButtonLabel?: string
  applyButtonStyle?: CSSProperties
  applyButtonClassName?: string
  applyIconClass?: string
  isLoading?: boolean
  className?: string
}

export type GluuFormFooterProps = GluuFormFooterBaseProps &
  (
    | { applyButtonType?: 'submit'; onApply?: () => void }
    | { applyButtonType: 'button'; onApply: () => void }
  )

export type GluuInlineInputProps = {
  label: string
  name: string
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url'
  value?: string | number | boolean | string[]
  required?: boolean
  lsize?: number
  rsize?: number
  isBoolean?: boolean
  isArray?: boolean
  handler: (patch: JsonPatch) => void
  options?: string[]
  path?: string
  doc_category?: string
  disabled?: boolean
  id?: string
  parentIsArray?: boolean
  showSaveButtons?: boolean
  placeholder?: string
}

export type ThemeContextValue = {
  state: {
    theme: string
  }
}

export type GluuLabelProps = {
  label: string
  required?: boolean
  size?: number
  doc_category?: string
  doc_entry?: string
  style?: CSSProperties
  allowColon?: boolean
  isDark?: boolean
  isDirect?: boolean
}

export type CountryOption = {
  name: string
  cca2: string
}

export type RemovableModifiedFieldValue = string | string[] | boolean

export type GluuRemovableSelectRowProps = {
  label: string
  name: string
  value?: string
  formik: FormikProps<Record<string, JsonValue>>
  values?: CountryOption[]
  lsize?: number
  handler: () => void
  doc_category?: string
  isDirect?: boolean
  hideRemoveButton?: boolean
  modifiedFields: Record<string, RemovableModifiedFieldValue>
  setModifiedFields: React.Dispatch<
    React.SetStateAction<Record<string, RemovableModifiedFieldValue>>
  >
}

export type TypeaheadOptionObject = {
  role?: string
  customOption?: boolean
  label?: string
  [key: string]: string | number | boolean | null | undefined | string[]
}

export type TypeaheadOption = string | TypeaheadOptionObject

export type GluuRemovableTypeAheadProps = {
  label: string
  name: string
  value?: TypeaheadOption[]
  formik: FormikProps<Record<string, string | string[] | boolean | null | undefined>>
  lsize?: number
  rsize?: number
  handler: () => void
  doc_category?: string
  options?: TypeaheadOption[]
  isDirect?: boolean
  allowNew?: boolean
  modifiedFields?: Record<string, RemovableModifiedFieldValue>
  setModifiedFields?: React.Dispatch<
    React.SetStateAction<Record<string, RemovableModifiedFieldValue>>
  >
  disabled?: boolean
  placeholder?: string
}

export type GluuScriptErrorModalProps = {
  title?: string
  error: string
  isOpen: boolean
  handler: () => void
}

export type GluuSecretDetailProps = {
  label: string
  value: string
  doc_category?: string
  doc_entry?: string
  lsize?: number
  rsize?: number
  labelStyle?: CSSProperties
  rowClassName?: string
}

export type SessionTimeoutDialogProps = {
  open: boolean
  countdown: number
  onLogout: () => void
  onContinue: () => void
  themeOverride?: 'light' | 'dark'
}

export type GluuStatusMessageProps = {
  message: string
  type: 'loading' | 'error' | 'success' | 'info'
  labelSize?: number
  colSize?: number
  inline?: boolean
}

export type NamedTab = {
  name: string
  path?: string | null
}

export type NavigationTab = NamedTab & {
  path: string
}

export type TabItem = string | NamedTab

export type TabPanelProps = {
  children?: ReactNode
  value: number
  px?: number
  py?: number
  index: number
}

export type GluuTabsProps = {
  tabNames: TabItem[]
  tabToShow: (tabName: string) => ReactNode
  withNavigation?: boolean
}

export type GluuTextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'small'
  | 'div'

export type GluuTextProps = HTMLAttributes<HTMLElement> & {
  variant?: GluuTextVariant
  children: ReactNode
  secondary?: boolean
  disableThemeColor?: boolean
  onLightSurface?: boolean
}

export type GluuThemeFormFooterBaseProps = {
  showBack?: boolean
  backButtonLabel?: string
  onBack?: () => void
  disableBack?: boolean
  showCancel?: boolean
  cancelButtonLabel?: string
  onCancel?: () => void
  disableCancel?: boolean
  showApply?: boolean
  disableApply?: boolean
  applyButtonLabel?: string
  isLoading?: boolean
  className?: string
  hideDivider?: boolean
}

export type GluuThemeFormFooterProps = GluuThemeFormFooterBaseProps &
  (
    | { applyButtonType?: 'submit'; onApply?: () => void }
    | { applyButtonType: 'button'; onApply: () => void }
  )

export type GluuTooltipProps = {
  doc_category?: string
  doc_entry: string
  isDirect?: boolean
  children?: ReactNode
  tooltipOnly?: boolean
  zIndex?: number
  place?: 'top' | 'right' | 'bottom' | 'left'
  content?: ReactNode
  positionStrategy?: 'absolute' | 'fixed'
  offset?: number
}

export type GluuUploadFileProps = {
  accept?: Accept
  onDrop: (files: File[]) => void
  placeholder: string
  onClearFiles: () => void
  disabled?: boolean
  fileName?: string | null
  showClearButton?: boolean
}

export type GluuViewDetailModalProps = {
  isOpen: boolean
  handleClose: () => void
  children: ReactNode
  hideFooter?: boolean
  title?: string
  contentClassName?: string
  contentStyle?: CSSProperties
  headerClassName?: string
  headerStyle?: CSSProperties
  modalClassName?: string
  modalStyle?: CSSProperties
  customHeader?: ReactNode
}

export type { JsonObject }
