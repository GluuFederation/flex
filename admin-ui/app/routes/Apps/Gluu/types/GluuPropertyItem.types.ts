export type GluuPropertyItemProps = {
  property: Record<string, string>
  position: number
  keyPlaceholder?: string
  valuePlaceholder?: string
  onPropertyChange: (position: number, event: React.ChangeEvent<HTMLInputElement>) => void
  onPropertyRemove: (position: number) => void
  disabled?: boolean
  isInputLables?: boolean
  keyLabel?: string
  valueLabel?: string
  isRemoveButton?: boolean
  isKeys?: boolean
  sm?: number
  multiProperties?: boolean
  destinationPlaceholder?: string
  sourcePlaceholder?: string
}
