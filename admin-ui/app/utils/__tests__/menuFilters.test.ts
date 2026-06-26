import { filterMenusByHealth, filterMenusByAuth, findFirstLeafPath } from '@/utils/menuFilters'
import { ROUTES } from '@/helpers/navigation'
import { JANS_SERVICES } from '@/constants'
import { CEDARLING_BYPASS, CEDAR_ACTIONS } from '@/cedarling/constants'
import { logger } from '@/utils/logger'
import type { MenuItem } from '@/components/Sidebar'
import type { AuthorizationResult, ResourceScopeEntry } from '@/cedarling/types'

jest.mock('@/utils/logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}))

const mockedLogger = logger as jest.Mocked<typeof logger>

describe('filterMenusByHealth', () => {
  it('keeps menus that are not gated by a health condition', () => {
    const menus: MenuItem[] = [{ title: 'Home', path: '/home' }]
    expect(filterMenusByHealth(menus, [])).toEqual(menus)
  })

  it('keeps a gated menu when its service is up', () => {
    const menus: MenuItem[] = [{ title: 'SCIM', path: ROUTES.SCIM_BASE }]
    const result = filterMenusByHealth(menus, [{ name: JANS_SERVICES.SCIM, status: 'up' }])
    expect(result).toHaveLength(1)
  })

  it('drops a gated menu when its service is not up', () => {
    const menus: MenuItem[] = [{ title: 'SCIM', path: ROUTES.SCIM_BASE }]
    const result = filterMenusByHealth(menus, [{ name: JANS_SERVICES.SCIM, status: 'down' }])
    expect(result).toHaveLength(0)
  })

  it('drops a gated menu when its service is absent', () => {
    const menus: MenuItem[] = [{ title: 'FIDO', path: ROUTES.FIDO_BASE }]
    expect(filterMenusByHealth(menus, [])).toHaveLength(0)
  })

  it('keeps a menu without a path', () => {
    const menus: MenuItem[] = [{ title: 'No path' }]
    expect(filterMenusByHealth(menus, [])).toHaveLength(1)
  })
})

describe('findFirstLeafPath', () => {
  it('returns null for an empty menu list', () => {
    expect(findFirstLeafPath([])).toBeNull()
  })

  it('returns the first leaf path', () => {
    const menus: MenuItem[] = [
      { title: 'A', path: '/a' },
      { title: 'B', path: '/b' },
    ]
    expect(findFirstLeafPath(menus)).toBe('/a')
  })

  it('descends into children to find the first leaf path', () => {
    const menus: MenuItem[] = [{ title: 'Parent', children: [{ title: 'Child', path: '/child' }] }]
    expect(findFirstLeafPath(menus)).toBe('/child')
  })

  it('skips a parent with empty children and returns the next leaf', () => {
    const menus: MenuItem[] = [
      { title: 'Empty parent', children: [] },
      { title: 'Leaf', path: '/leaf' },
    ]
    expect(findFirstLeafPath(menus)).toBe('/leaf')
  })

  it('returns null when no item has a path', () => {
    expect(findFirstLeafPath([{ title: 'No path' }])).toBeNull()
  })
})

describe('filterMenusByAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const authorize = (results: AuthorizationResult[]) =>
    jest.fn((_scopes: ResourceScopeEntry[]) => Promise.resolve(results))

  it('keeps a menu item that has no action', async () => {
    const menus: MenuItem[] = [{ title: 'Static', path: '/static' }]
    const result = await filterMenusByAuth(menus, authorize([]))
    expect(result).toEqual(menus)
  })

  it('keeps an action item that the user is authorized for', async () => {
    const menus: MenuItem[] = [{ title: 'Read', action: CEDAR_ACTIONS.READ, resourceKey: 'home' }]
    const helper = authorize([{ isAuthorized: true }])
    const result = await filterMenusByAuth(menus, helper)
    expect(result).toHaveLength(1)
    expect(helper).toHaveBeenCalled()
  })

  it('drops an action item that the user is not authorized for', async () => {
    const menus: MenuItem[] = [{ title: 'Read', action: CEDAR_ACTIONS.READ, resourceKey: 'home' }]
    const result = await filterMenusByAuth(menus, authorize([{ isAuthorized: false }]))
    expect(result).toHaveLength(0)
  })

  it('bypasses authorization for a cedarling-bypass resource', async () => {
    const menus: MenuItem[] = [
      { title: 'Bypass', action: CEDAR_ACTIONS.READ, resourceKey: CEDARLING_BYPASS },
    ]
    const helper = authorize([])
    const result = await filterMenusByAuth(menus, helper)
    expect(result).toHaveLength(1)
    expect(helper).not.toHaveBeenCalled()
  })

  it('drops an action item missing a resourceKey and logs a warning', async () => {
    const menus: MenuItem[] = [{ title: 'Missing key', action: CEDAR_ACTIONS.READ }]
    const result = await filterMenusByAuth(menus, authorize([]))
    expect(result).toHaveLength(0)
    expect(mockedLogger.warn).toHaveBeenCalled()
  })

  it('keeps a parent only when at least one child survives', async () => {
    const menus: MenuItem[] = [
      {
        title: 'Parent',
        children: [
          { title: 'Allowed', action: CEDAR_ACTIONS.READ, resourceKey: 'Clients' },
          { title: 'Denied', action: CEDAR_ACTIONS.READ, resourceKey: 'Scopes' },
        ],
      },
    ]
    const helper = jest.fn((scopes: ResourceScopeEntry[]) =>
      Promise.resolve([{ isAuthorized: scopes[0].resourceId === 'Clients' }]),
    )
    const result = await filterMenusByAuth(menus, helper)
    expect(result).toHaveLength(1)
    expect(result[0].children).toHaveLength(1)
  })

  it('drops a parent whose children are all filtered out', async () => {
    const menus: MenuItem[] = [
      {
        title: 'Parent',
        children: [{ title: 'Denied', action: CEDAR_ACTIONS.READ, resourceKey: 'denied' }],
      },
    ]
    const result = await filterMenusByAuth(menus, authorize([{ isAuthorized: false }]))
    expect(result).toHaveLength(0)
  })
})
