import {
  aggregateUserFailures,
  filterUsersUnderSiege,
  takeTopUsersByFailure,
} from 'Plugins/fido/components/SecurityMonitor/utils'
import { THREAT_LEVELS } from 'Plugins/fido/components/SecurityMonitor/constants'
import type { MetricsEntry } from 'Plugins/fido/components/Metrics/types'
import type { UserFailureStat } from 'Plugins/fido/components/SecurityMonitor/types'

// Mirrors the shape returned by /fido2/metrics/entries/operation/AUTHENTICATION: an ATTEMPT
// row opens each operation, an outcome row closes it, and ABANDONED rows carry no ipAddress.
const attempt = (username?: string): MetricsEntry => ({
  operationType: 'AUTHENTICATION',
  status: 'ATTEMPT',
  ipAddress: '198.211.103.43',
  ...(username ? { username } : {}),
})

const abandoned = (username: string): MetricsEntry => ({
  operationType: 'AUTHENTICATION',
  status: 'ABANDONED',
  username,
})

const success = (username: string): MetricsEntry => ({
  operationType: 'AUTHENTICATION',
  status: 'SUCCESS',
  ipAddress: '198.211.103.43',
  username,
})

describe('aggregateUserFailures', () => {
  it('counts abandoned rows that carry no IP address', () => {
    const stats = aggregateUserFailures([abandoned('imran'), abandoned('imran')])

    expect(stats).toHaveLength(1)
    expect(stats[0]).toMatchObject({ username: 'imran', abandoned: 2, failures: 2 })
  })

  it('ignores ATTEMPT rows so an operation is never counted twice', () => {
    const stats = aggregateUserFailures([
      attempt('imran'),
      abandoned('imran'),
      attempt('imran'),
      success('imran'),
    ])

    expect(stats[0]).toMatchObject({ outcomes: 2, abandoned: 1, successes: 1, failures: 1 })
    expect(stats[0]!.failureRate).toBe(50)
  })

  it('separates explicit failures from abandoned sessions', () => {
    const stats = aggregateUserFailures([
      abandoned('imran'),
      { operationType: 'AUTHENTICATION', status: 'FAILURE', username: 'imran' },
    ])

    expect(stats[0]).toMatchObject({ failed: 1, abandoned: 1, failures: 2 })
  })

  it('keeps every user rather than only the busiest address', () => {
    const stats = aggregateUserFailures([
      abandoned('imran'),
      abandoned('imran'),
      abandoned('admin'),
      success('carol'),
    ])

    expect(stats.map((stat) => stat.username)).toEqual(['imran', 'admin', 'carol'])
    expect(takeTopUsersByFailure(stats).map((stat) => stat.username)).toEqual(['imran', 'admin'])
  })

  it('skips entries with no identity', () => {
    expect(aggregateUserFailures([attempt(), { operationType: 'AUTHENTICATION' }])).toEqual([])
  })

  it('falls back to the user id when no username is present', () => {
    const stats = aggregateUserFailures([
      { operationType: 'AUTHENTICATION', status: 'ABANDONED', userId: 'abc-123' },
    ])

    expect(stats[0]!.username).toBe('abc-123')
  })
})

describe('filterUsersUnderSiege', () => {
  const stat = (username: string, failures: number, outcomes: number): UserFailureStat => ({
    username,
    failures,
    failed: failures,
    abandoned: 0,
    successes: outcomes - failures,
    outcomes,
    failureRate: outcomes ? Math.round((failures / outcomes) * 100) : 0,
    lastSeen: 0,
    threatLevel: THREAT_LEVELS.LOW,
  })

  it('keeps an account on sustained failure volume alone', () => {
    expect(filterUsersUnderSiege([stat('john', 5, 100)]).map((s) => s.username)).toEqual(['john'])
  })

  it('keeps a smaller run that almost never succeeds', () => {
    expect(filterUsersUnderSiege([stat('berry', 3, 4)]).map((s) => s.username)).toEqual(['berry'])
  })

  it('leaves a busy account with a healthy success rate alone', () => {
    expect(filterUsersUnderSiege([stat('paul', 4, 100)])).toEqual([])
  })
})
