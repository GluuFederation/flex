import type React from 'react'

export interface GluuAdvancedSearchProps {
  handler?: (
    event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  patternId: string
  limitId: string
  limit: number
  pattern?: string
  showLimit?: boolean
  controlled?: boolean
}
