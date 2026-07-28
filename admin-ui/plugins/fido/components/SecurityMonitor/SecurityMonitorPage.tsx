import React, { useCallback, useMemo, useState } from 'react'
import { GluuPageContent } from 'Components'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import SetTitle from 'Utils/SetTitle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { CSV_MIME_TYPE, toCsv } from '@/utils/csv'
import { downloadTextFile } from '@/utils/fileDownload'
import { createDate } from '@/utils/dayjsUtils'
import { useSecurityStyles } from './SecurityMonitorPage.style'
import {
  AttackPulseChart,
  DeviceFingerprintChart,
  ErrorIntelligenceChart,
  SecurityKpiStrip,
  SecurityMonitorHeader,
  SessionIntegrityChart,
  ThreatOriginsChart,
  VelocityWatchHeatmap,
} from './components'
import { useSecurityDashboardData, useSecurityTheme } from './hooks'
import { buildSecurityExportRows } from './utils'
import { KPI_PERIODS, KPI_PERIOD_GRANULARITY } from './constants'
import type { KpiPeriod } from './types'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.FIDO

const FIDO2_QUERY_ROOT = 'fido2'

const SecurityMonitorPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.passkey_security_monitor'))

  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { themeColors, isDark } = useSecurityTheme()
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const { canRead: canView } = usePermission(SECURITY_RESOURCE_ID)

  const [nowValue, setNowValue] = useState(() => createDate().valueOf())
  const [period, setPeriod] = useState<KpiPeriod>(KPI_PERIODS.TODAY)

  const data = useSecurityDashboardData(nowValue, period)
  const anomalyGranularity = KPI_PERIOD_GRANULARITY[period]

  const handleRefresh = useCallback(() => {
    setNowValue(createDate().valueOf())
    queryClient.invalidateQueries({ queryKey: [FIDO2_QUERY_ROOT] })
  }, [queryClient])

  const handleExport = useCallback(() => {
    const ipWindowLabel =
      period === KPI_PERIODS.TODAY ? t('fields.ip_window_last_hour') : t(`fields.period_${period}`)
    const rows = buildSecurityExportRows(data, t, period, anomalyGranularity, ipWindowLabel)

    if (!rows.length) {
      dispatch(updateToast(true, 'error', t('messages.no_data_to_export')))
      return
    }

    const csv = toCsv(
      [
        t('fields.export_section'),
        t('fields.label'),
        t('fields.export_measure'),
        t('fields.value'),
        t('fields.export_unit'),
      ],
      rows,
    )
    downloadTextFile(
      csv,
      `passkey-security-monitor-${createDate(nowValue).format('YYYYMMDD-HHmm')}.csv`,
      CSV_MIME_TYPE,
    )
  }, [
    data.summary,
    data.spikeSeries,
    data.dropOffSeries,
    data.ipStats,
    data.errorSlices,
    data.velocityMatrix,
    data.deviceTrend,
    data.suspiciousIps,
    t,
    period,
    anomalyGranularity,
    dispatch,
    nowValue,
  ])

  const tabNames = useMemo(
    () => [
      t('fields.security_tab_live_threats', { total: data.anomalies.count }),
      t('fields.security_tab_attack_origins'),
      t('fields.security_tab_behavioral_patterns'),
    ],
    [t, data.anomalies.count],
  )

  const tabToShow = useCallback(
    (tabName: string) => {
      switch (tabName) {
        case tabNames[0]:
          return (
            <>
              <div className={classes.fullWidthRow}>
                <AttackPulseChart series={data.spikeSeries} />
              </div>
              <div className={classes.fullWidthRow}>
                <SessionIntegrityChart series={data.dropOffSeries} />
              </div>
            </>
          )
        case tabNames[1]:
          return (
            <div className={classes.chartRow}>
              <ThreatOriginsChart ipStats={data.ipStats} />
              <ErrorIntelligenceChart slices={data.errorSlices} />
            </div>
          )
        case tabNames[2]:
          return (
            <>
              <div className={classes.fullWidthRow}>
                <VelocityWatchHeatmap matrix={data.velocityMatrix} />
              </div>
              <div className={classes.fullWidthRow}>
                <DeviceFingerprintChart trend={data.deviceTrend} />
              </div>
            </>
          )
        default:
          return null
      }
    },
    [
      tabNames,
      classes,
      data.spikeSeries,
      data.dropOffSeries,
      data.ipStats,
      data.errorSlices,
      data.velocityMatrix,
      data.deviceTrend,
    ],
  )

  return (
    <GluuLoader blocking={data.isLoading || data.isFetching}>
      <GluuViewWrapper canShow={canView}>
        <GluuPageContent>
          <SecurityMonitorHeader
            anomalies={data.anomalies}
            period={period}
            onPeriodChange={setPeriod}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
          <SecurityKpiStrip
            summary={data.summary}
            suspiciousIps={data.suspiciousIps}
            period={period}
          />
          <GluuTabs tabNames={tabNames} tabToShow={tabToShow} />
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default SecurityMonitorPage
