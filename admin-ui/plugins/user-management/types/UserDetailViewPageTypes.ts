export interface CustomAttrWithValues {
  name?: string
  value?: string | number | boolean
  values?: (string | number | boolean)[]
  multiValued?: boolean
}
