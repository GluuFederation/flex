import {
  buildFailureSpikeSeries,
  countSequenceSpikesInRange,
  countSpikesInRange,
} from 'Plugins/fido/components/SecurityMonitor/utils'
import { createDate } from '@/utils/dayjsUtils'
import type { AggregationEntry } from 'Plugins/fido/components/Metrics/types'

const entry = (iso: string, failures: number): AggregationEntry => ({
  startTime: iso,
  authenticationFailures: failures,
  authenticationAttempts: failures + 10,
  authenticationSuccesses: 10,
})

const todayStart = createDate().startOf('day')
const todayEnd = createDate().endOf('day')

describe('countSpikesInRange', () => {
  const spikeHour = todayStart.add(10, 'hour')
  const withBaseline = [
    ...Array.from({ length: 7 }, (_, i) =>
      entry(spikeHour.subtract(7 - i, 'day').toISOString(), 2),
    ),
    entry(spikeHour.toISOString(), 500),
  ]

  it('counts a spike whose baseline lies outside the reported window', () => {
    expect(countSpikesInRange(withBaseline, todayStart, todayEnd)).toBe(1)
  })

  it('agrees with the chart series for the same window', () => {
    const chartSpikes = buildFailureSpikeSeries(withBaseline, todayStart).filter((p) => p.isSpike)
    expect(countSpikesInRange(withBaseline, todayStart, todayEnd)).toBe(chartSpikes.length)
  })

  it('counts every spiking bucket in the window', () => {
    const entries = [
      ...Array.from({ length: 7 }, (_, day) =>
        Array.from({ length: 24 }, (_, hour) =>
          entry(
            todayStart
              .subtract(7 - day, 'day')
              .add(hour, 'hour')
              .toISOString(),
            1,
          ),
        ),
      ).flat(),
      ...Array.from({ length: 24 }, (_, hour) =>
        entry(todayStart.add(hour, 'hour').toISOString(), 900),
      ),
    ]
    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(24)
  })

  it('excludes spikes outside the window', () => {
    const yesterdayHour = todayStart.subtract(1, 'day').add(10, 'hour')
    const entries = [
      ...Array.from({ length: 7 }, (_, i) =>
        entry(yesterdayHour.subtract(7 - i, 'day').toISOString(), 2),
      ),
      entry(yesterdayHour.toISOString(), 400),
    ]
    expect(countSpikesInRange(entries, todayStart, todayEnd)).toBe(0)
    expect(
      countSpikesInRange(
        entries,
        todayStart.subtract(1, 'day'),
        todayStart.subtract(1, 'millisecond'),
      ),
    ).toBe(1)
  })

  it('returns 0 when there is no spike', () => {
    const flat = Array.from({ length: 8 }, (_, i) =>
      entry(spikeHour.subtract(7 - i, 'day').toISOString(), 5),
    )
    expect(countSpikesInRange(flat, todayStart, todayEnd)).toBe(0)
  })

  it('handles empty input', () => {
    expect(countSpikesInRange([], todayStart, todayEnd)).toBe(0)
  })
})

describe('countSequenceSpikesInRange', () => {
  const monthStart = createDate().startOf('month')

  it('uses history before the window to judge points inside it', () => {
    const entries = [
      ...Array.from({ length: 7 }, (_, i) =>
        entry(monthStart.subtract(7 - i, 'month').toISOString(), 2),
      ),
      entry(monthStart.toISOString(), 200),
    ]
    expect(countSequenceSpikesInRange(entries, monthStart, todayEnd)).toBe(1)
  })

  it('excludes spikes outside the window', () => {
    const entries = [
      ...Array.from({ length: 7 }, (_, i) =>
        entry(monthStart.subtract(9 - i, 'month').toISOString(), 2),
      ),
      entry(monthStart.subtract(2, 'month').toISOString(), 200),
    ]
    expect(countSequenceSpikesInRange(entries, monthStart, todayEnd)).toBe(0)
  })

  it('handles empty input', () => {
    expect(countSequenceSpikesInRange([], monthStart, todayEnd)).toBe(0)
  })
})
