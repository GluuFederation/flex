import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@mui/material/useMediaQuery'
import { GluuButton } from '@/components/GluuButton'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { DownloadIcon, FilterListIcon, RefreshIcon } from '@/components/icons'
import MobileNavSheet from '@/components/MobileBottomNav/MobileNavSheet'
import { SHEET_KEYS } from '@/components/MobileBottomNav/sheetConstants'
import { FILTER_SHEET, MOBILE_MEDIA_QUERY, OPACITY } from '@/constants'
import { fontWeights } from '@/styles/fonts'
import { useSecurityTheme } from '../hooks'
import { useSecurityStyles } from '../SecurityMonitorPage.style'
import { KPI_PERIOD_ORDER } from '../constants'
import AnomalyBanner from './AnomalyBanner'
import PeriodToggle from './PeriodToggle'
import type { KpiPeriod, SecurityMonitorHeaderProps } from '../types'

const SecurityMonitorHeader: React.FC<SecurityMonitorHeaderProps> = ({
  anomalies,
  period,
  onPeriodChange,
  onRefresh,
  onExport,
}) => {
  const { t } = useTranslation()
  const { themeColors, isDark } = useSecurityTheme()
  const { classes, cx } = useSecurityStyles({ isDark, themeColors })
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [draftPeriod, setDraftPeriod] = useState<KpiPeriod>(period)

  useEffect(() => {
    setDraftPeriod(period)
  }, [period])

  const periodOptions = useMemo(
    () =>
      KPI_PERIOD_ORDER.map((value) => ({
        value,
        label: t(`fields.period_${value}`),
      })),
    [t],
  )

  const handlePeriodChange = useCallback(
    (value: string) => {
      onPeriodChange(value as KpiPeriod)
    },
    [onPeriodChange],
  )

  const openSheet = useCallback(() => {
    setDraftPeriod(period)
    setSheetOpen(true)
  }, [period])

  const closeSheet = useCallback(() => {
    setSheetOpen(false)
  }, [])

  const cancelSheet = useCallback(() => {
    setDraftPeriod(period)
    setSheetOpen(false)
  }, [period])

  const applySheet = useCallback(() => {
    onPeriodChange(draftPeriod)
    setSheetOpen(false)
  }, [draftPeriod, onPeriodChange])

  const handleSheetRefresh = useCallback(() => {
    setSheetOpen(false)
    onRefresh()
  }, [onRefresh])

  const handleSheetExport = useCallback(() => {
    setSheetOpen(false)
    onExport()
  }, [onExport])

  const accentColor = themeColors.badges.filledBadgeBg
  const accentTextColor = themeColors.badges.filledBadgeText

  if (isMobile) {
    return (
      <div className={classes.pageHeader}>
        <GluuText variant="h1" className={classes.mobilePageTitle}>
          {t('titles.passkey_security_monitor')}
        </GluuText>
        <div className={classes.mobileHeaderRow}>
          <AnomalyBanner anomalies={anomalies} />
          <button
            type="button"
            aria-label={t('titles.filters')}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className={classes.mobileTrigger}
            onClick={openSheet}
          >
            <FilterListIcon />
          </button>
        </div>
        <MobileNavSheet
          openKey={sheetOpen ? SHEET_KEYS.CUSTOM : null}
          onClose={closeSheet}
          title={t('titles.filters')}
        >
          <div className={classes.sheetContent}>
            <div className={classes.sheetPills} role="group" aria-label={t('fields.period')}>
              {periodOptions.map((option) => {
                const selected = draftPeriod === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    className={cx(classes.sheetPill, selected && classes.sheetPillSelected)}
                    onClick={() => setDraftPeriod(option.value)}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <div className={classes.sheetActions}>
              <GluuButton
                type="button"
                size="md"
                block
                outlined
                onClick={handleSheetExport}
                textColor={themeColors.fontColor}
                borderColor={themeColors.borderColor}
                borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                fontWeight={fontWeights.bold}
                aria-label={t('actions.export')}
              >
                <DownloadIcon className={classes.sheetButtonIcon} />
                {t('actions.export')}
              </GluuButton>
              <GluuButton
                type="button"
                size="md"
                block
                outlined
                onClick={handleSheetRefresh}
                textColor={themeColors.fontColor}
                borderColor={themeColors.borderColor}
                borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                fontWeight={fontWeights.bold}
                aria-label={t('actions.refresh')}
              >
                <RefreshIcon className={classes.sheetButtonIcon} />
                {t('actions.refresh')}
              </GluuButton>
            </div>
            <div className={classes.sheetButtonRow}>
              <GluuButton
                type="button"
                size="md"
                block
                outlined
                onClick={cancelSheet}
                textColor={themeColors.fontColor}
                borderColor={themeColors.borderColor}
                borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                fontWeight={fontWeights.bold}
              >
                {t('actions.cancel')}
              </GluuButton>
              <GluuButton
                type="button"
                size="md"
                block
                onClick={applySheet}
                backgroundColor={accentColor}
                borderColor={accentColor}
                textColor={accentTextColor}
                borderRadius={FILTER_SHEET.BUTTON_RADIUS}
                minHeight={FILTER_SHEET.BUTTON_HEIGHT}
                fontWeight={fontWeights.bold}
                useOpacityOnHover
                hoverOpacity={OPACITY.OVERLAY}
              >
                {t('actions.apply')}
              </GluuButton>
            </div>
          </div>
        </MobileNavSheet>
      </div>
    )
  }

  return (
    <div className={classes.pageHeader}>
      <AnomalyBanner anomalies={anomalies} />
      <div className={classes.headerActions}>
        <PeriodToggle
          options={periodOptions}
          value={period}
          onChange={handlePeriodChange}
          ariaLabel={t('fields.period')}
        />
        <div className={classes.headerButtons}>
          <GluuButton
            type="button"
            size="md"
            outlined
            onClick={onExport}
            textColor={themeColors.fontColor}
            borderColor={themeColors.borderColor}
            aria-label={t('actions.export')}
          >
            {t('actions.export')}
          </GluuButton>
          <GluuButton
            type="button"
            size="md"
            onClick={onRefresh}
            backgroundColor={accentColor}
            textColor={accentTextColor}
            borderColor={accentColor}
            fontWeight={fontWeights.bold}
            disableHoverStyles
            aria-label={t('actions.refresh')}
          >
            {t('actions.refresh')}
          </GluuButton>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SecurityMonitorHeader)
