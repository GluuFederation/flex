import type { MetricAggregationEntry, MetricDataEntry } from 'JansConfigApi'
import { AXIS_KEYS } from 'Plugins/fido/components/AuthMetrics/constants'
import { createDate } from '@/utils/dayjsUtils'
import {
  buildChartRows,
  endOfDay,
  formatDateForApi,
  granularitiesForRange,
  groupBySubType,
  parseMetricData,
  plainPoints,
  resolveGranularity,
  startOfDay,
  subTypePoints,
  sumCounts,
  toMetricPoints,
} from 'Plugins/fido/components/AuthMetrics/utils'

const ANCHOR = Date.UTC(2026, 7, 20, 0, 0, 0)

describe('formatDateForApi', () => {
  it('sends the selected wall-clock time, with no UTC conversion', () => {
    const picked = new Date(2026, 7, 20, 0, 0, 0)

    expect(formatDateForApi(picked)).toBe('2026-08-20T00:00:00')
  })

  it('emits no Z suffix, which would make the server read the value as UTC', () => {
    expect(formatDateForApi(new Date(2026, 7, 20, 23, 59, 0))).toBe('2026-08-20T23:59:00')
  })
})

describe('UTC handling of server timestamps', () => {
  const shapes = [
    ['bare, no offset', '2026-08-20T06:50:00'],
    ['Z suffix', '2026-08-20T06:50:00.000Z'],
    ['explicit +00:00', '2026-08-20T06:50:00+00:00'],
  ] as const

  it.each(shapes)('reads a %s timestamp as UTC', (_name, startDate) => {
    const [point] = toMetricPoints([{ startDate, data: { count: 1 } } as MetricDataEntry], 'HH:mm')

    expect(point.label).toBe('06:50')
  })

  it('converts a non-UTC offset rather than dropping it, matching the server', () => {
    const [point] = toMetricPoints(
      [{ startDate: '2026-08-20T06:50:00+05:00', data: { count: 1 } } as MetricDataEntry],
      'HH:mm',
    )

    expect(point.label).toBe('01:50')
  })

  it('cuts daily buckets at UTC midnight, not the viewer local midnight', () => {
    const rows = buildChartRows(
      [
        {
          key: 'success',
          points: toMetricPoints(
            [
              { startDate: '2026-08-20T00:30:00Z', data: { count: 1 } } as MetricDataEntry,
              { startDate: '2026-08-20T23:30:00Z', data: { count: 2 } } as MetricDataEntry,
            ],
            'HH:mm',
          ),
        },
      ],
      'DAILY',
      ANCHOR,
    )

    expect(rows).toHaveLength(1)
    expect(rows[0].success).toBe(3)
    expect(rows[0][AXIS_KEYS.LABEL]).toBe('Aug-20')
  })
})

describe('preset window boundaries', () => {
  const startOfWindow = (days: number) => startOfDay(createDate().subtract(days - 1, 'day'))

  it.each([
    ['24 Hours', 1],
    ['7 Days', 7],
    ['30 Days', 30],
  ])('has the %s preset cover exactly that many calendar dates', (_name, days) => {
    const start = startOfWindow(days)
    const end = endOfDay(createDate())

    expect(end.diff(start, 'day') + 1).toBe(days)
  })

  it.each([
    ['24 Hours', 1, ['HOURLY', 'HOURS_3', 'HOURS_12', 'HOURS_24']],
    ['7 Days', 7, ['DAILY', 'DAYS_3', 'DAYS_7']],
    ['30 Days', 30, ['DAILY', 'DAYS_3', 'DAYS_7', 'DAYS_15', 'DAYS_21', 'DAYS_30']],
  ])('keeps the %s preset in its own granularity tier', (_name, days, expected) => {
    const granularities = granularitiesForRange(
      startOfWindow(days).toDate(),
      endOfDay(createDate()).toDate(),
    )

    expect(granularities).toEqual(expected)
  })
})

describe('granularitiesForRange', () => {
  const spanOf = (days: number): [Date, Date] => [
    new Date(2026, 7, 20 - days, 0, 0, 0),
    new Date(2026, 7, 20, 23, 59, 0),
  ]

  it.each([
    ['a single day', 0, ['HOURLY', 'HOURS_3', 'HOURS_12', 'HOURS_24']],
    ['the 24 Hours preset', 1, ['HOURLY', 'HOURS_3', 'HOURS_12', 'HOURS_24']],
    ['the 7 Days preset', 7, ['DAILY', 'DAYS_3', 'DAYS_7']],
    ['a fortnight', 14, ['DAILY', 'DAYS_3', 'DAYS_7']],
    ['the 30 Days preset', 30, ['DAILY', 'DAYS_3', 'DAYS_7', 'DAYS_15', 'DAYS_21', 'DAYS_30']],
  ])('offers %s the right tier', (_name, days, expected) => {
    expect(granularitiesForRange(...spanOf(days))).toEqual(expected)
  })

  it('falls back to the finest tier when the range is reversed', () => {
    const [start, end] = spanOf(7)

    expect(granularitiesForRange(end, start)).toEqual(['HOURLY', 'HOURS_3', 'HOURS_12', 'HOURS_24'])
  })
})

describe('multi-unit bucket widths', () => {
  const hourlyRows = Array.from({ length: 48 }, (_, hour) => ({
    startDate: new Date(ANCHOR + hour * 3_600_000).toISOString(),
    data: { count: 1 },
  })) as MetricDataEntry[]

  const rowsAt = (granularity: string) =>
    buildChartRows(
      [{ key: 'success', points: toMetricPoints(hourlyRows, 'HH:mm') }],
      granularity as never,
      ANCHOR,
    )

  it.each([
    ['HOURLY', 48, 1],
    ['HOURS_3', 16, 3],
    ['HOURS_12', 4, 12],
    ['HOURS_24', 2, 24],
    ['DAILY', 2, 24],
    ['DAYS_3', 1, 48],
    ['DAYS_7', 1, 48],
  ])('folds 48 hourly rows into %s buckets', (granularity, expectedRows, expectedPerBucket) => {
    const rows = rowsAt(granularity)

    expect(rows).toHaveLength(expectedRows)
    expect(rows[0].success).toBe(expectedPerBucket)
  })

  it.each(['HOURLY', 'HOURS_3', 'HOURS_12', 'HOURS_24', 'DAILY', 'DAYS_3', 'DAYS_7', 'DAYS_30'])(
    'preserves the total at %s',
    (granularity) => {
      const total = rowsAt(granularity).reduce((sum, row) => sum + Number(row.success), 0)

      expect(total).toBe(48)
    },
  )

  it('measures buckets from the range start rather than from the epoch', () => {
    const [first] = rowsAt('DAYS_3')

    expect(first[AXIS_KEYS.TIMESTAMP]).toBe(ANCHOR)
  })
})

describe('resolveGranularity', () => {
  it('keeps the choice when the range still allows it', () => {
    expect(resolveGranularity('DAILY', ['DAILY', 'DAYS_3', 'DAYS_7'])).toBe('DAILY')
  })

  it('falls back to the finest allowed when the choice is out of range', () => {
    expect(resolveGranularity('HOURLY', ['DAILY', 'DAYS_3', 'DAYS_7'])).toBe('DAILY')
  })
})

describe('startOfDay and endOfDay', () => {
  it('widens a mid-afternoon pick to cover the whole day', () => {
    const picked = createDate(new Date(2026, 7, 20, 14, 37, 12))

    expect(formatDateForApi(startOfDay(picked).toDate())).toBe('2026-08-20T00:00:00')
    expect(formatDateForApi(endOfDay(picked).toDate())).toBe('2026-08-20T23:59:00')
  })

  it('keeps both ends on the date that was picked', () => {
    const picked = createDate(new Date(2026, 7, 20, 0, 0, 0))

    expect(startOfDay(picked).date()).toBe(20)
    expect(endOfDay(picked).date()).toBe(20)
  })
})

describe('parseMetricData', () => {
  it('parses a JSON string payload', () => {
    expect(parseMetricData('{"success":10,"failure":2}')).toEqual({ success: 10, failure: 2 })
  })

  it('reads an object payload directly', () => {
    expect(parseMetricData({ success: 10 })).toEqual({ success: 10 })
  })

  it('addresses nested values by dotted path', () => {
    expect(parseMetricData({ auth: { success: 3, nested: { latency: 12.5 } } })).toEqual({
      'auth.success': 3,
      'auth.nested.latency': 12.5,
    })
  })

  it('coerces quoted numbers, since counters often arrive as strings', () => {
    expect(parseMetricData('{"success":"42"}')).toEqual({ success: 42 })
  })

  it('skips non-numeric and non-finite values instead of emitting NaN', () => {
    expect(parseMetricData({ label: 'basic', ok: true, bad: 'abc', empty: '' })).toEqual({})
  })

  it.each([['{not json'], [null], [undefined], ['']])('returns no values for %p', (input) => {
    expect(parseMetricData(input)).toEqual({})
  })
})

describe('toMetricPoints', () => {
  const entry = (startDate: string, data: string): MetricAggregationEntry => ({
    startDate,
    applicationType: 'jans_auth',
    metricType: 'user_authentication_success',
    metricSubType: 'basic',
    data,
  })

  it('sorts chronologically regardless of response order', () => {
    const points = toMetricPoints(
      [entry('2026-08-03T00:00:00Z', '{"n":3}'), entry('2026-08-01T00:00:00Z', '{"n":1}')],
      'MMM-DD',
    )

    expect(points.map((p) => p.values.n)).toEqual([1, 3])
  })

  it('carries the identifying fields and retains the raw payload', () => {
    const [point] = toMetricPoints([entry('2026-08-01T00:00:00Z', '{"n":1}')], 'MMM-DD')

    expect(point).toMatchObject({
      appType: 'jans_auth',
      metricType: 'user_authentication_success',
      subType: 'basic',
      values: { n: 1 },
      raw: '{"n":1}',
    })
  })

  it('keeps an unparseable entry rather than dropping it silently', () => {
    const points = toMetricPoints([entry('2026-08-01T00:00:00Z', 'not-json')], 'MMM-DD')

    expect(points).toHaveLength(1)
    expect(points[0]!.values).toEqual({})
    expect(points[0]!.raw).toBe('not-json')
  })

  it('returns nothing for a missing entry list', () => {
    expect(toMetricPoints(undefined, 'MMM-DD')).toEqual([])
  })
})

const entry = (startDate: string, count: number, metricSubType?: string): MetricDataEntry => ({
  startDate,
  metricSubType,
  data: { count },
})

describe('plainPoints and subTypePoints', () => {
  const points = toMetricPoints(
    [entry('2026-08-19T06:00:00Z', 6), entry('2026-08-19T06:00:00Z', 6, 'basic')],
    'MMM-DD',
  )

  it('keeps only the untagged rows for a total', () => {
    expect(sumCounts(plainPoints(points))).toBe(6)
  })

  it('keeps only the tagged rows for a breakdown', () => {
    expect(subTypePoints(points).map((point) => point.subType)).toEqual(['basic'])
  })
})

describe('buildChartRows', () => {
  const at = (iso: string, count: number) => toMetricPoints([entry(iso, count)], 'MMM-DD')[0]

  it('sums five-minute rows into the requested bucket', () => {
    const rows = buildChartRows(
      [
        {
          key: 'success',
          points: [at('2026-08-19T06:05:00Z', 2), at('2026-08-19T06:55:00Z', 3)],
        },
      ],
      'HOURLY',
      ANCHOR,
    )

    expect(rows).toHaveLength(1)
    expect(rows[0].success).toBe(5)
  })

  it('zero-fills a series that has no row in a bucket, so its line stays connected', () => {
    const rows = buildChartRows(
      [
        { key: 'success', points: [at('2026-08-19T06:00:00Z', 4)] },
        { key: 'failure', points: [] },
      ],
      'HOURLY',
      ANCHOR,
    )

    expect(rows[0].failure).toBe(0)
  })

  it('orders buckets chronologically regardless of input order', () => {
    const rows = buildChartRows(
      [
        {
          key: 'success',
          points: [at('2026-08-20T06:00:00Z', 1), at('2026-08-19T06:00:00Z', 2)],
        },
      ],
      'DAILY',
      ANCHOR,
    )

    expect(rows.map((row) => row.success)).toEqual([2, 1])
  })

  it('keeps the axis fields intact when a series is named after one', () => {
    const rows = buildChartRows(
      [
        { key: 'label', points: [at('2026-08-19T06:00:00Z', 7)] },
        { key: 'timestamp', points: [at('2026-08-19T06:00:00Z', 9)] },
      ],
      'DAILY',
      ANCHOR,
    )

    expect(typeof rows[0]![AXIS_KEYS.LABEL]).toBe('string')
    expect(rows[0]![AXIS_KEYS.TIMESTAMP]).toBeGreaterThan(0)
    expect(rows[0]!.label).toBe(7)
    expect(rows[0]!.timestamp).toBe(9)
  })
})

describe('groupBySubType', () => {
  it('splits each acr into its own series, sorted so colours stay stable', () => {
    const points = toMetricPoints(
      [
        entry('2026-08-19T06:00:00Z', 1, 'simple_password_auth'),
        entry('2026-08-19T06:00:00Z', 2, 'basic'),
        entry('2026-08-19T06:00:00Z', 3),
      ],
      'MMM-DD',
    )

    expect(groupBySubType(points).map((series) => series.key)).toEqual([
      'basic',
      'simple_password_auth',
    ])
  })
})
