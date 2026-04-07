import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { SSA } from 'Utils/ApiResources'
import { formatExpirationDate } from '../utils/dateFormatters'
import type { SsaDetailViewPageProps } from '../types'

const SsaDetailViewPage: React.FC<SsaDetailViewPageProps> = ({ row }) => {
  const { t } = useTranslation()

  const getDetailFields = useCallback(
    (): GluuDetailGridField[] => [
      {
        label: 'fields.software_id',
        value: row.ssa.software_id || null,
        doc_entry: 'software_id',
        doc_category: SSA,
      },
      {
        label: 'fields.description',
        value: row.ssa.description || null,
        doc_entry: 'description',
        doc_category: SSA,
      },
      {
        label: 'fields.status',
        value: row.status || null,
        doc_entry: 'status',
        doc_category: SSA,
        isBadge: true,
        badgeBackgroundColor: row.status?.toLowerCase() === 'active' ? '#e6f4ea' : '#fce4ec',
        badgeTextColor: row.status?.toLowerCase() === 'active' ? '#1e7e34' : '#c62828',
      },
      {
        label: 'fields.one_time_use',
        value: row.ssa.one_time_use ? t('options.true') : t('options.false'),
        doc_entry: 'one_time_use',
        doc_category: SSA,
        isBadge: true,
        badgeBackgroundColor: row.ssa.one_time_use ? '#e3f2fd' : '#fce4ec',
        badgeTextColor: row.ssa.one_time_use ? '#1565c0' : '#c62828',
      },
      {
        label: 'fields.rotate_ssa',
        value: row.ssa.rotate_ssa ? t('options.true') : t('options.false'),
        doc_entry: 'rotate_ssa',
        doc_category: SSA,
        isBadge: true,
        badgeBackgroundColor: row.ssa.rotate_ssa ? '#e3f2fd' : '#fce4ec',
        badgeTextColor: row.ssa.rotate_ssa ? '#1565c0' : '#c62828',
      },
      {
        label: 'fields.organization',
        value: row.ssa.org_id || null,
        doc_entry: 'org_id',
        doc_category: SSA,
      },
      {
        label: 'fields.expiration',
        value: formatExpirationDate(row.expiration),
        doc_entry: 'expiration',
        doc_category: SSA,
      },
      {
        label: 'fields.grant_types',
        value: row.ssa.grant_types?.join(', ') || null,
        doc_entry: 'grant_types',
        doc_category: SSA,
        isBadge: true,
        badgeBackgroundColor: '#e8f5e9',
        badgeTextColor: '#2e7d32',
      },
    ],
    [row, t],
  )

  return <GluuDetailGrid fields={getDetailFields()} defaultDocCategory={SSA} layout="column" />
}

export default React.memo(SsaDetailViewPage)
