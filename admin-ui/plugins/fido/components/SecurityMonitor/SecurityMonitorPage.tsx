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
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
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
import { useSecurityDashboardData } from './hooks'
import { ALL_USERS_OPTION, KPI_PERIODS } from './constants'
import type { KpiPeriod } from './types'

const SECURITY_RESOURCE_ID = ADMIN_UI_RESOURCES.FIDO

const FIDO2_QUERY_ROOT = 'fido2'

const SecurityMonitorPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.passkey_security_monitor'))

  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useSecurityStyles({ isDark, themeColors })

  const { canRead: canView } = usePermission(SECURITY_RESOURCE_ID)

  const [nowValue, setNowValue] = useState(() => createDate().valueOf())
  const [selectedUserId, setSelectedUserId] = useState<string>(ALL_USERS_OPTION)
  const [period, setPeriod] = useState<KpiPeriod>(KPI_PERIODS.TODAY)

  const data = useSecurityDashboardData(nowValue, selectedUserId)

  const handleRefresh = useCallback(() => {
    setNowValue(createDate().valueOf())
    queryClient.invalidateQueries({ queryKey: [FIDO2_QUERY_ROOT] })
  }, [queryClient])

  const handleExport = useCallback(() => {
    const rows: (string | number)[][] = [
      ...data.spikeSeries.map((point) => [
        t('fields.auth_failures'),
        point.label,
        point.failures,
        point.baseline,
      ]),
      ...data.ipStats.map((stat) => [
        t('fields.ip_address'),
        stat.ipAddress,
        stat.failures,
        stat.failureRate,
      ]),
      ...data.errorSlices.map((slice) => [
        t('fields.error_category'),
        slice.category,
        slice.count,
        slice.share,
      ]),
    ]

    if (!rows.length) {
      dispatch(updateToast(true, 'error', t('messages.no_data_to_export')))
      return
    }

    const csv = toCsv(
      [t('fields.metric'), t('fields.label'), t('fields.value'), t('fields.secondary_value')],
      rows,
    )
    downloadTextFile(
      csv,
      `passkey-security-monitor-${createDate(nowValue).format('YYYYMMDD-HHmm')}.csv`,
      CSV_MIME_TYPE,
    )
  }, [data.spikeSeries, data.ipStats, data.errorSlices, dispatch, t, nowValue])

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUserId(userId)
  }, [])

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
                <VelocityWatchHeatmap
                  matrix={data.velocityMatrix}
                  userIds={data.userIds}
                  selectedUserId={selectedUserId}
                  onSelectUser={handleSelectUser}
                />
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
    [tabNames, classes, data, selectedUserId, handleSelectUser],
  )

  return (
    <GluuLoader blocking={data.isLoading}>
      <GluuViewWrapper canShow={canView}>
        <GluuPageContent>
          <SecurityMonitorHeader
            anomalies={data.anomalies}
            period={period}
            onPeriodChange={setPeriod}
            isFetching={data.isFetching}
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
