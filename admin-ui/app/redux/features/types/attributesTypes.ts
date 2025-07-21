export interface AttributeItem {
  displayName: string
  [key: string]: any
}

export interface AttributesState {
  items: AttributeItem[]
  loading: boolean
  initLoading: boolean
}
