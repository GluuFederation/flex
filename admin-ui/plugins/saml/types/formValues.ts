export interface SamlConfigurationFormValues {
  enabled: boolean
  selectedIdp: string
  ignoreValidation: boolean
  applicationName: string
}

export interface LocationState<T = unknown> {
  rowData?: T
  viewOnly?: boolean
}
