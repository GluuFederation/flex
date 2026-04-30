import customColors from '@/customColors'

export const METRICS_CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,
  GC_TIME: 10 * 60 * 1000,
} as const

export const METRICS_CHART_COLORS = {
  successRate: customColors.statusActive,
  errorRate: customColors.statusInactive,
  dropOffRate: customColors.orange,
  newUsers: customColors.statusActive,
  totalUsers: customColors.lightBlue,
  adoptionRate: customColors.chartPurple,

  minDuration: customColors.chartPurple,
  avgDuration: customColors.chartCoral,
  maxDuration: customColors.chartCyan,
} as const

export const AGGREGATION_SERIES_COLORS = {
  regSuccess: customColors.orange,
  regAttempts: '#90caf9',
  authAttempts: customColors.statusActive,
  authSuccess: customColors.chartCoral,
} as const

export const HEATMAP_COLOR_STOPS = [
  { stop: 0, color: '#fff9c4' },
  { stop: 0.2, color: '#ffcc80' },
  { stop: 0.45, color: '#ffa726' },
  { stop: 0.65, color: '#ef5350' },
  { stop: 0.85, color: '#c62828' },
  { stop: 1, color: '#7b0000' },
] as const

export const MOCK_METRICS_DATA = {
  passkeyAuth: [
    { name: 'fields.success_rate', value: 75, color: METRICS_CHART_COLORS.successRate },
    { name: 'fields.error_rate', value: 15, color: METRICS_CHART_COLORS.errorRate },
    { name: 'fields.drop_off_rate', value: 10, color: METRICS_CHART_COLORS.dropOffRate },
  ],
  adoption: {
    newRegisteredUsers: 3,
    totalRegisteredUsers: 12,
    adoptionPasskeyRate: 25,
    chartData: [{ name: 'Users', newUsers: 3, totalUsers: 12 }],
  },
  onboardingTime: [
    { category: 'fields.authentication', minDuration: 172, avgDuration: 172, maxDuration: 172 },
    { category: 'fields.registration', minDuration: 51, avgDuration: 261, maxDuration: 472 },
  ],
} as const

export const AGGREGATION_TYPES = ['hourly', 'daily', 'weekly', 'monthly'] as const
export type AggregationType = (typeof AGGREGATION_TYPES)[number]

const makeHourlyGrid = (seed: number): number[][] => {
  const rows: number[][] = []
  for (let r = 0; r < 12; r++) {
    const row: number[] = []
    for (let c = 0; c < 24; c++) {
      const peak = c >= 12 && c <= 15 ? 1.5 : 0
      const base = 1.0 + ((r * 3 + c * 7 + seed) % 12) * 0.1 + peak
      row.push(Math.round(Math.min(3.5, Math.max(1.0, base)) * 10) / 10)
    }
    rows.push(row)
  }
  return rows
}

const HOURLY_ROWS = [
  'Feb-12',
  'Feb-11',
  'Feb-10',
  'Feb-9',
  'Feb-8',
  'Feb-7',
  'Feb-6',
  'Feb-5',
  'Feb-4',
  'Feb-3',
  'Feb-2',
  'Feb-1',
]
const HOURLY_COLS = Array.from({ length: 24 }, (_, i) => String(i + 1))

export const MOCK_AGGREGATION = {
  hourly: {
    activity: [
      {
        label: 'Hourly Feb 02\nto Feb-10',
        regSuccess: 0,
        regAttempts: 0,
        authAttempts: 0,
        authSuccess: 0,
      },
      {
        label: 'Feb-02 H12',
        regSuccess: 55,
        regAttempts: 135,
        authAttempts: 150,
        authSuccess: 100,
      },
      { label: 'Feb-09 H14', regSuccess: 0, regAttempts: 0, authAttempts: 170, authSuccess: 70 },
      { label: 'Feb-16 H15', regSuccess: 0, regAttempts: 0, authAttempts: 220, authSuccess: 100 },
      {
        label: 'Feb-23 H16',
        regSuccess: 150,
        regAttempts: 210,
        authAttempts: 230,
        authSuccess: 100,
      },
    ],
    registrationHeatmap: {
      rows: HOURLY_ROWS,
      cols: HOURLY_COLS,
      data: makeHourlyGrid(3),
      minVal: 1.0,
      maxVal: 3.5,
    },
    authHeatmap: {
      rows: HOURLY_ROWS,
      cols: HOURLY_COLS,
      data: makeHourlyGrid(7),
      minVal: 1.0,
      maxVal: 3.5,
    },
  },
  daily: {
    activity: [
      {
        label: 'Daily Feb 02\nto Feb-10',
        regSuccess: 0,
        regAttempts: 0,
        authAttempts: 0,
        authSuccess: 0,
      },
      { label: 'Feb 02', regSuccess: 80, regAttempts: 160, authAttempts: 190, authSuccess: 120 },
      { label: 'Feb 08', regSuccess: 110, regAttempts: 195, authAttempts: 220, authSuccess: 140 },
      { label: 'Feb 09', regSuccess: 95, regAttempts: 180, authAttempts: 240, authSuccess: 160 },
      { label: 'Feb 15', regSuccess: 130, regAttempts: 210, authAttempts: 210, authSuccess: 175 },
    ],
    combinedHeatmap: {
      rows: ['Registration', 'Authentication'],
      cols: ['Feb 02', 'Feb 08', 'Feb 09', 'Feb 10'],
      data: [
        [150, 225, 250, 235],
        [170, 200, 165, 215],
      ],
      minVal: 100,
      maxVal: 300,
    },
  },
  weekly: {
    activity: [
      {
        label: 'Weekly Feb 01\nto Feb-29',
        regSuccess: 0,
        regAttempts: 0,
        authAttempts: 0,
        authSuccess: 0,
      },
      { label: 'Feb-02', regSuccess: 55, regAttempts: 135, authAttempts: 150, authSuccess: 100 },
      { label: 'Feb-09', regSuccess: 115, regAttempts: 200, authAttempts: 160, authSuccess: 60 },
      { label: 'Feb-16', regSuccess: 157, regAttempts: 210, authAttempts: 250, authSuccess: 100 },
      { label: 'Feb-23', regSuccess: 150, regAttempts: 210, authAttempts: 225, authSuccess: 100 },
    ],
    durationHeatmap: {
      rows: ['Authentication', 'Registration'],
      cols: ['Week 1', 'Week 2'],
      colsSub: ['Feb-02', 'Feb-09'],
      data: [
        [188, 243],
        [185, 190],
      ],
      minVal: 140,
      maxVal: 250,
    },
  },
  monthly: {
    activity: [
      {
        label: 'Monthly Feb 2026\nto May 2026',
        regSuccess: 0,
        regAttempts: 0,
        authAttempts: 0,
        authSuccess: 0,
      },
      { label: 'Feb-2026', regSuccess: 150, regAttempts: 200, authAttempts: 175, authSuccess: 110 },
      { label: 'Mar-2026', regSuccess: 170, regAttempts: 250, authAttempts: 230, authSuccess: 150 },
      { label: 'Apr-2026', regSuccess: 190, regAttempts: 260, authAttempts: 255, authSuccess: 165 },
      { label: 'May-2026', regSuccess: 160, regAttempts: 240, authAttempts: 235, authSuccess: 145 },
    ],
    combinedHeatmap: {
      rows: ['Authentication', 'Registration'],
      cols: ['Feb-2026', 'Mar-2026', 'Apr-2026', 'May-2026'],
      data: [
        [150, 175, 250, 230],
        [135, 200, 165, 210],
      ],
      minVal: 130,
      maxVal: 250,
    },
  },
} as const
