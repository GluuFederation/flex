import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GluuDropdown } from '@/components/GluuDropdown'
import { GluuButton } from '@/components/GluuButton'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import { ALL_USERS_OPTION, CHART_EMPTY_INSET } from '../constants'
import { buildVelocityScaffoldRows, getSecurityPalette } from '../utils'
import SecurityChartCard from './SecurityChartCard'
import type { VelocityHeatmapProps } from '../types'

const VELOCITY_EMPTY_INSET = {
  top: CHART_EMPTY_INSET.VELOCITY_HEADER_HEIGHT,
}

const VelocityWatchHeatmap: React.FC<VelocityHeatmapProps> = ({
  matrix,
  userIds,
  selectedUserId,
  onSelectUser,
}) => {
  const { t } = useTranslation()
  const { themeColors, isDark } = useSecurityTheme()
  const palette = useMemo(() => getSecurityPalette(themeColors), [themeColors])
  const { classes, cx } = useSecurityStyles({ isDark, themeColors })

  const options = useMemo(
    () => [
      { value: ALL_USERS_OPTION, label: t('fields.all_users') },
      ...userIds.map((userId) => ({ value: userId, label: userId })),
    ],
    [userIds, t],
  )

  const handleSelect = useCallback(
    (value: string | number | boolean) => {
      onSelectUser(String(value))
    },
    [onSelectUser],
  )

  const selectedLabel = selectedUserId === ALL_USERS_OPTION ? t('fields.all_users') : selectedUserId

  const isEmpty = matrix.cells.every((row) => row.every((cell) => cell.value === 0))
  const rows = useMemo(
    () => (matrix.rows.length ? matrix.rows : buildVelocityScaffoldRows()),
    [matrix.rows],
  )

  return (
    <SecurityChartCard
      title={t('titles.velocity_watch')}
      subtitle={t('fields.velocity_watch_subtitle')}
      statusLabel={
        matrix.anomalousUsers
          ? t('fields.users_anomalous', { count: matrix.anomalousUsers })
          : undefined
      }
      accentColor={matrix.anomalousUsers ? palette.velocityCells.anomalous : undefined}
      headerExtra={
        <GluuDropdown
          options={options}
          selectedValue={selectedUserId}
          onSelect={handleSelect}
          minWidth={200}
          trigger={
            <GluuButton type="button" size="sm" aria-label={t('fields.user')}>
              {selectedLabel}
            </GluuButton>
          }
        />
      }
      isEmpty={isEmpty}
      emptyLabel={t('fields.no_data')}
      emptyInset={VELOCITY_EMPTY_INSET}
    >
      <div className={classes.tableWrapper}>
        <table className={classes.velocityTable}>
          <thead>
            <tr>
              <th
                className={cx(classes.velocityCorner, isEmpty && classes.velocityLabelCollapsed)}
                scope="col"
              >
                {isEmpty ? '' : t('fields.user')}
              </th>
              {matrix.cols.map((col) => (
                <th key={col} className={classes.velocityHeadCell} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row}>
                <th
                  className={cx(
                    classes.velocityRowLabel,
                    isEmpty && classes.velocityLabelCollapsed,
                  )}
                  scope="row"
                >
                  {row}
                </th>
                {matrix.cols.map((col, colIndex) => {
                  const cell = matrix.cells[rowIndex]?.[colIndex]
                  const value = cell?.value ?? 0
                  const background = !value
                    ? palette.velocityCells.empty
                    : cell?.isAnomalous
                      ? palette.velocityCells.anomalous
                      : palette.velocityCells.normal
                  return (
                    <td
                      key={col}
                      className={classes.velocityCell}
                      style={{ backgroundColor: background }}
                      aria-label={
                        cell?.isAnomalous
                          ? t('fields.velocity_cell_anomalous', { count: value, window: col })
                          : undefined
                      }
                    >
                      {value || ''}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SecurityChartCard>
  )
}

export default React.memo(VelocityWatchHeatmap)
