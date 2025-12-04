import React from 'react'
import { Paper } from '@mui/material'
import type { TFunction } from 'i18next'

export interface TableColumn {
  title: string
  field: string
}

export const getIdentityProviderTableCols = (t: TFunction): TableColumn[] => [
  {
    title: `${t('fields.inum')}`,
    field: 'inum',
  },
  {
    title: `${t('fields.displayName')}`,
    field: 'displayName',
  },
  {
    title: `${t('fields.enabled')}`,
    field: 'enabled',
  },
]

export const getServiceProviderTableCols = (t: TFunction): TableColumn[] => [
  {
    title: `${t('fields.inum')}`,
    field: 'inum',
  },
  {
    title: `${t('fields.displayName')}`,
    field: 'displayName',
  },
  {
    title: `${t('fields.enabled')}`,
    field: 'enabled',
  },
]

export const PaperContainer = React.memo((props: React.ComponentProps<typeof Paper>) => (
  <Paper {...props} elevation={0} />
))

PaperContainer.displayName = 'PaperContainer'
