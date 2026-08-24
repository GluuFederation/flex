import { renderHook } from '@testing-library/react'
import { CHART_AXIS } from '@/constants'
import { useChartTheme } from '../useChartTheme'

let mockTheme = 'light'
jest.mock('@/context/theme/themeContext', () => ({
  useTheme: () => ({ state: { theme: mockTheme } }),
}))

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

describe('useChartTheme', () => {
  beforeEach(() => {
    mockTheme = 'light'
  })

  it('exposes shared grid and axis config from the theme', () => {
    const { result } = renderHook(() => useChartTheme())

    expect(result.current.gridProps.strokeDasharray).toBe(CHART_AXIS.GRID_DASH)
    expect(result.current.gridProps.stroke).toBe(result.current.themeColors.borderColor)
    expect(result.current.axisTick).toEqual({
      fill: result.current.themeColors.fontColor,
      fontSize: CHART_AXIS.TICK_FONT_SIZE,
    })
  })

  it('tracks the active theme', () => {
    const { result: light } = renderHook(() => useChartTheme())
    expect(light.current.isDark).toBe(false)

    mockTheme = 'dark'
    const { result: dark } = renderHook(() => useChartTheme())
    expect(dark.current.isDark).toBe(true)
    expect(dark.current.cardBg).not.toBe(light.current.cardBg)
  })

  it('hands the tooltip its payload plus the themed card colors', () => {
    const { result } = renderHook(() => useChartTheme())
    const payload = [{ name: 'mau', value: 12, dataKey: 'mau', graphicalItemId: 'mau-line' }]

    const tooltip = result.current.renderTooltip({ active: true, payload })

    expect(tooltip.props).toMatchObject({
      payload,
      active: true,
      backgroundColor: result.current.cardBg,
      textColor: result.current.themeColors.fontColor,
      isDark: false,
    })
  })
})
