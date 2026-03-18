import { useContext, useMemo, memo } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import customColors from '@/customColors'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { GluuDetailGrid, type GluuDetailGridField } from '@/components/GluuDetailGrid'
import { API_ATTRIBUTE } from '../constants'
import type {
  AttributeDetailPageProps,
  DetailThemeContextType,
} from './types/UserClaimsListPage.types'

const displayOrDash = (value: string | null | undefined): string =>
  value === null || value === undefined || value === '' ? '—' : value

const UserClaimsDetailPage = ({ row }: AttributeDetailPageProps): JSX.Element => {
  const theme = useContext(ThemeContext) as DetailThemeContextType
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const labelStyle = useMemo(() => ({ color: themeColors.fontColor }), [themeColors.fontColor])

  const isActive = row.status?.toLowerCase() === 'active'

  const fields: GluuDetailGridField[] = useMemo(
    () => [
      {
        label: 'fields.name',
        value: displayOrDash(row.name),
        doc_entry: 'name',
        doc_category: API_ATTRIBUTE,
      },
      {
        label: 'fields.displayname',
        value: displayOrDash(row.displayName),
        doc_entry: 'displayName',
        doc_category: API_ATTRIBUTE,
      },
      {
        label: 'fields.status',
        value: displayOrDash(row.status),
        doc_entry: 'status',
        doc_category: API_ATTRIBUTE,
        isBadge: true,
        badgeBackgroundColor: isActive
          ? themeColors.badges.statusActiveBg
          : customColors.statusInactiveBg,
        badgeTextColor: isActive ? themeColors.badges.statusActive : customColors.statusInactive,
      },
      {
        label: 'fields.attribute_edit_type',
        value:
          Array.isArray(row.editType) && row.editType.length > 0 ? row.editType.join(', ') : '—',
        doc_entry: 'editType',
        doc_category: API_ATTRIBUTE,
        isBadge: Array.isArray(row.editType) && row.editType.length > 0,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: 'fields.attribute_view_type',
        value:
          Array.isArray(row.viewType) && row.viewType.length > 0 ? row.viewType.join(', ') : '—',
        doc_entry: 'viewType',
        doc_category: API_ATTRIBUTE,
        isBadge: Array.isArray(row.viewType) && row.viewType.length > 0,
        badgeBackgroundColor: themeColors.badges.filledBadgeBg,
        badgeTextColor: themeColors.badges.filledBadgeText,
      },
      {
        label: 'fields.description',
        value: displayOrDash(row.description),
        doc_entry: 'description',
        doc_category: API_ATTRIBUTE,
      },
    ],
    [row, isActive, themeColors],
  )

  return (
    <GluuDetailGrid
      fields={fields}
      labelStyle={labelStyle}
      defaultDocCategory={API_ATTRIBUTE}
      layout="column"
    />
  )
}

export default memo(UserClaimsDetailPage)
