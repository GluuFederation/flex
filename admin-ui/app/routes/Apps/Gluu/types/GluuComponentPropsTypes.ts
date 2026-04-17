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

export type GluuBooleanSelectBoxProps<T extends object = Record<string, JsonValue>> = {
  label: string
  name: string
  value?: boolean | string
  formik: FormikProps<T>
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  toToggle?: boolean
}

type DialogRow = {
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

type GluuFormFooterBaseProps = {
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

type CountryOption = {
  name: string
  cca2: string
}

type RemovableModifiedFieldValue = string | string[] | boolean

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

type NamedTab = {
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

type GluuTextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small' | 'div'

export type GluuTextProps = HTMLAttributes<HTMLElement> & {
  variant?: GluuTextVariant
  children?: ReactNode
  secondary?: boolean
  disableThemeColor?: boolean
  onLightSurface?: boolean
}

type GluuThemeFormFooterStepNavigation = {
  currentIndex: number
  total: number
  onPrev: () => void
  onNextStep: () => void
}

type GluuThemeFormFooterBaseProps = {
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
  stepNavigation?: GluuThemeFormFooterStepNavigation
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
  place?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
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
