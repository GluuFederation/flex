import {
  base64ToUint8Array,
  decodedByteLength,
  isActivePolicyStore,
  selectActivePolicyStore,
  toPolicyStoreEntries,
  toPolicyStoreTotal,
} from '../policyStore'

const inactive = { inum: 'a', jansStatus: 'inactive' as const }
const active = { inum: 'b', jansStatus: 'active' as const }

describe('toPolicyStoreEntries', () => {
  it('reads the paged envelope shape', () => {
    expect(toPolicyStoreEntries({ entries: [active] })).toEqual([active])
  })

  it('reads the bare array shape the spec declares', () => {
    expect(toPolicyStoreEntries([active])).toEqual([active])
  })

  it.each([[null], [undefined], [{}], [{ entries: null }], ['nonsense'], [42]])(
    'returns [] for %p',
    (payload) => {
      expect(toPolicyStoreEntries(payload as Parameters<typeof toPolicyStoreEntries>[0])).toEqual(
        [],
      )
    },
  )
})

describe('toPolicyStoreTotal', () => {
  it('prefers totalEntriesCount from the envelope', () => {
    expect(toPolicyStoreTotal({ entries: [active], totalEntriesCount: 17 })).toBe(17)
  })

  it('falls back to the page length for a bare array', () => {
    expect(toPolicyStoreTotal([active, inactive])).toBe(2)
  })

  it('falls back to the page length when the envelope omits a total', () => {
    expect(toPolicyStoreTotal({ entries: [active] })).toBe(1)
  })

  it('ignores a non-finite total', () => {
    expect(toPolicyStoreTotal({ entries: [active], totalEntriesCount: Number.NaN })).toBe(1)
  })
})

describe('selectActivePolicyStore', () => {
  it('picks the active entry regardless of position', () => {
    expect(selectActivePolicyStore([inactive, active])).toBe(active)
  })

  it('never guesses: returns undefined when the page holds no active entry', () => {
    expect(selectActivePolicyStore([inactive])).toBeUndefined()
    expect(selectActivePolicyStore([inactive, { inum: 'c' }])).toBeUndefined()
  })

  it('returns undefined for an empty list', () => {
    expect(selectActivePolicyStore([])).toBeUndefined()
  })
})

describe('isActivePolicyStore', () => {
  it('is true only for the active status', () => {
    expect(isActivePolicyStore(active)).toBe(true)
    expect(isActivePolicyStore(inactive)).toBe(false)
    expect(isActivePolicyStore({ inum: 'c' })).toBe(false)
  })
})

describe('base64ToUint8Array', () => {
  it('decodes to the original bytes', () => {
    expect(Array.from(base64ToUint8Array(btoa('hello')))).toEqual([104, 101, 108, 108, 111])
  })

  it('produces an ArrayBuffer-backed view usable as a BlobPart', () => {
    expect(base64ToUint8Array(btoa('hi')).buffer).toBeInstanceOf(ArrayBuffer)
  })
})

describe('decodedByteLength', () => {
  it.each([
    ['', 0],
    ['aGk=', 2],
    ['aGVsbG8=', 5],
    ['aGVsbG8h', 6],
    ['YQ==', 1],
  ])('sizes %p as %i bytes', (base64, expected) => {
    expect(decodedByteLength(base64)).toBe(expected)
  })

  it('returns 0 for undefined or whitespace', () => {
    expect(decodedByteLength(undefined)).toBe(0)
    expect(decodedByteLength('   ')).toBe(0)
  })

  it('agrees with the decoded length', () => {
    const base64 = btoa('a policy store archive')
    expect(decodedByteLength(base64)).toBe(base64ToUint8Array(base64).length)
  })
})
