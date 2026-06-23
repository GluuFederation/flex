import {
  interpolateHeatmapColor,
  getNiceStep,
  toNumber,
  toPercent,
  formatChartValue,
  formatNonZeroChartValue,
  buildRangeLabel,
  entriesToActivityData,
  entriesToHeatmapData,
  entriesToHourlyHeatmap,
} from 'Plugins/fido/components/Metrics/utils'
import { createDate } from '@/utils/dayjsUtils'
import type { TFunction } from 'i18next'
import type { AggregationEntry, MetricsDateRange } from 'Plugins/fido/components/Metrics/types'
import type { AggregationType } from 'Plugins/fido/components/Metrics/constants'

const t = ((key: string, opts?: Record<string, string | number>) =>
  opts ? `${key}:${JSON.stringify(opts)}` : key) as TFunction

describe('Metrics utils', () => {
  describe('interpolateHeatmapColor', () => {
    it('returns an rgb color string', () => {
      expect(interpolateHeatmapColor(5, 0, 10)).toMatch(/^rgb\(\d+,\d+,\d+\)$/)
    })

    it('clamps values below the minimum to the first stop', () => {
      const atMin = interpolateHeatmapColor(0, 0, 10)
      const belowMin = interpolateHeatmapColor(-5, 0, 10)
      expect(belowMin).toBe(atMin)
    })

    it('clamps values above the maximum to the last stop', () => {
      const atMax = interpolateHeatmapColor(10, 0, 10)
      const aboveMax = interpolateHeatmapColor(50, 0, 10)
      expect(aboveMax).toBe(atMax)
    })

    it('produces different colors across the range', () => {
      const low = interpolateHeatmapColor(1, 0, 10)
      const high = interpolateHeatmapColor(9, 0, 10)
      expect(low).not.toBe(high)
    })
  })

  describe('getNiceStep', () => {
    it('returns 1 when the range is zero or negative', () => {
      expect(getNiceStep(5, 5)).toBe(1)
      expect(getNiceStep(10, 5)).toBe(1)
    })

    it('returns a positive step for a normal range', () => {
      expect(getNiceStep(0, 100)).toBeGreaterThan(0)
    })

    it('never returns less than 1', () => {
      expect(getNiceStep(0, 0.5)).toBeGreaterThanOrEqual(1)
    })

    it('scales with the magnitude of the range', () => {
      const small = getNiceStep(0, 10)
      const large = getNiceStep(0, 10000)
      expect(large).toBeGreaterThan(small)
    })
  })

  describe('toNumber', () => {
    it('returns finite numbers unchanged', () => {
      expect(toNumber(42)).toBe(42)
      expect(toNumber(0)).toBe(0)
    })

    it('returns 0 for non-numbers', () => {
      expect(toNumber('5')).toBe(0)
      expect(toNumber(null)).toBe(0)
      expect(toNumber(undefined)).toBe(0)
      expect(toNumber(true)).toBe(0)
    })

    it('returns 0 for non-finite numbers', () => {
      expect(toNumber(Infinity)).toBe(0)
      expect(toNumber(NaN)).toBe(0)
    })
  })

  describe('toPercent', () => {
    it('returns 0 for non-numbers and NaN', () => {
      expect(toPercent(null)).toBe(0)
      expect(toPercent(undefined)).toBe(0)
      expect(toPercent(NaN)).toBe(0)
    })

    it('treats fractions (<= 1) as ratios and scales to percent', () => {
      expect(toPercent(0.5)).toBe(50)
      expect(toPercent(1)).toBe(100)
    })

    it('treats values > 1 as already a percent', () => {
      expect(toPercent(75)).toBe(75)
    })

    it('clamps to the 0-100 range', () => {
      expect(toPercent(150)).toBe(100)
      expect(toPercent(-10)).toBe(0)
    })
  })

  describe('formatChartValue', () => {
    it('formats numeric values to at most 2 decimals', () => {
      expect(formatChartValue(3.14159)).toBe('3.14')
      expect(formatChartValue(5)).toBe('5')
    })

    it('parses numeric strings', () => {
      expect(formatChartValue('10.5')).toBe('10.5')
    })

    it('returns empty string for unparsable values', () => {
      expect(formatChartValue('abc')).toBe('')
      expect(formatChartValue(undefined)).toBe('')
    })

    it('keeps zero as "0"', () => {
      expect(formatChartValue(0)).toBe('0')
    })
  })

  describe('formatNonZeroChartValue', () => {
    it('formats positive values', () => {
      expect(formatNonZeroChartValue(2.5)).toBe('2.5')
    })

    it('returns empty string for zero and negative values', () => {
      expect(formatNonZeroChartValue(0)).toBe('')
      expect(formatNonZeroChartValue(-3)).toBe('')
    })

    it('returns empty string for non-finite values', () => {
      expect(formatNonZeroChartValue('xyz')).toBe('')
      expect(formatNonZeroChartValue(null)).toBe('')
    })
  })

  describe('buildRangeLabel', () => {
    const range: MetricsDateRange = {
      startDate: createDate('2024-01-01'),
      endDate: createDate('2024-01-31'),
    }

    it('builds a label including the range type', () => {
      const label = buildRangeLabel('daily' as AggregationType, range, t)
      expect(label).toContain('fields.agg_range_label')
      expect(label).toContain('fields.agg_type_daily')
    })

    it('handles weekly and monthly aggregation types', () => {
      expect(buildRangeLabel('weekly' as AggregationType, range, t)).toContain(
        'fields.agg_type_weekly',
      )
      expect(buildRangeLabel('monthly' as AggregationType, range, t)).toContain(
        'fields.agg_type_monthly',
      )
    })
  })

  describe('entriesToActivityData', () => {
    const entries: AggregationEntry[] = [
      {
        period: '2024-01-01',
        registrationSuccesses: 5,
        registrationAttempts: 8,
        authenticationAttempts: 10,
        authenticationSuccesses: 9,
      },
    ]

    it('maps entries into activity data points', () => {
      const result = entriesToActivityData(entries, 'daily' as AggregationType)
      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        regSuccess: 5,
        regAttempts: 8,
        authAttempts: 10,
        authSuccess: 9,
      })
      expect(typeof result[0]!.label).toBe('string')
    })

    it('defaults missing numeric fields to 0', () => {
      const result = entriesToActivityData([{ period: '2024-01-02' }])
      expect(result[0]).toMatchObject({
        regSuccess: 0,
        regAttempts: 0,
        authAttempts: 0,
        authSuccess: 0,
      })
    })

    it('formats hourly labels for the hourly aggregation type', () => {
      const result = entriesToActivityData(
        [{ period: '2024-01-01-14', registrationSuccesses: 1 }],
        'hourly' as AggregationType,
      )
      expect(result[0]!.label).toContain('H')
    })

    it('returns an empty array for no entries', () => {
      expect(entriesToActivityData([])).toEqual([])
    })
  })

  describe('entriesToHeatmapData', () => {
    const entries: AggregationEntry[] = [
      { period: '2024-01-01', authenticationAvgDuration: 100, registrationAvgDuration: 50 },
      { period: '2024-01-02', authenticationAvgDuration: 200, registrationAvgDuration: 80 },
    ]

    it('returns two rows for authentication and registration', () => {
      const data = entriesToHeatmapData(entries, 'daily' as AggregationType, t)
      expect(data.rows).toHaveLength(2)
      expect(data.data).toHaveLength(2)
      expect(data.cols).toHaveLength(2)
    })

    it('computes min and max from durations', () => {
      const data = entriesToHeatmapData(entries, 'daily' as AggregationType, t)
      expect(data.minVal).toBeGreaterThanOrEqual(0)
      expect(data.maxVal).toBeGreaterThan(data.minVal)
    })

    it('adds colsSub for the weekly aggregation type', () => {
      const data = entriesToHeatmapData(entries, 'weekly' as AggregationType, t)
      expect(data.colsSub).toBeDefined()
      expect(data.colsSub).toHaveLength(2)
    })

    it('handles empty entries without crashing', () => {
      const data = entriesToHeatmapData([], 'daily' as AggregationType, t)
      expect(data.cols).toEqual([])
      expect(data.maxVal).toBeGreaterThan(data.minVal)
    })
  })

  describe('entriesToHourlyHeatmap', () => {
    const entries: AggregationEntry[] = [
      { period: '2024-01-01-09', registrationAvgDuration: 30, authenticationAvgDuration: 40 },
      { period: '2024-01-01-10', registrationAvgDuration: 60, authenticationAvgDuration: 70 },
    ]

    it('builds a 24-column heatmap for registration', () => {
      const data = entriesToHourlyHeatmap(entries, 'registration')
      expect(data.cols).toHaveLength(24)
      expect(data.rows.length).toBeGreaterThan(0)
    })

    it('builds a heatmap for authentication', () => {
      const data = entriesToHourlyHeatmap(entries, 'authentication')
      expect(data.cols).toHaveLength(24)
    })

    it('skips entries that have no parsable hourly period', () => {
      const data = entriesToHourlyHeatmap([{ id: 'no-period' }], 'registration')
      expect(data.rows).toHaveLength(0)
    })

    it('computes min and max bounds', () => {
      const data = entriesToHourlyHeatmap(entries, 'registration')
      expect(data.minVal).toBeGreaterThanOrEqual(0)
      expect(data.maxVal).toBeGreaterThan(data.minVal)
    })
  })
})
