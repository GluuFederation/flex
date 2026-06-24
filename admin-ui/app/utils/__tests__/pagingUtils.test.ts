import {
  ROWS_PER_PAGE_OPTIONS,
  PAGING_SIZE_CHANGED_EVENT,
  getDefaultPagingSize,
  getRowsPerPageOptions,
  savePagingSize,
} from '@/utils/pagingUtils'
import { storage } from '@/utils/storage'
import { logger } from '@/utils/logger'

jest.mock('@/utils/storage', () => ({
  storage: { get: jest.fn(), set: jest.fn() },
}))

jest.mock('@/utils/logger', () => ({
  logger: { warn: jest.fn(), error: jest.fn() },
}))

const mockedStorage = storage as jest.Mocked<typeof storage>
const mockedLogger = logger as jest.Mocked<typeof logger>

describe('constants', () => {
  it('exposes the rows-per-page options', () => {
    expect(ROWS_PER_PAGE_OPTIONS).toEqual([5, 10, 25, 50])
  })

  it('exposes the paging-size changed event name', () => {
    expect(PAGING_SIZE_CHANGED_EVENT).toBe('gluu:pagingSizeChanged')
  })
})

describe('getRowsPerPageOptions', () => {
  it('returns a copy equal to the options', () => {
    const opts = getRowsPerPageOptions()
    expect(opts).toEqual([5, 10, 25, 50])
    expect(Array.isArray(opts)).toBe(true)
  })
})

describe('getDefaultPagingSize', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns the stored value when it is a valid option', () => {
    mockedStorage.get.mockReturnValue('25')
    expect(getDefaultPagingSize()).toBe(25)
  })

  it('falls back to the default when nothing is stored', () => {
    mockedStorage.get.mockReturnValue(null)
    expect(getDefaultPagingSize()).toBe(10)
  })

  it('falls back to the default when the stored value is not a valid option', () => {
    mockedStorage.get.mockReturnValue('7')
    expect(getDefaultPagingSize()).toBe(10)
  })

  it('falls back to the default when the stored value is not numeric', () => {
    mockedStorage.get.mockReturnValue('abc')
    expect(getDefaultPagingSize()).toBe(10)
  })

  it('falls back to the default when storage throws', () => {
    mockedStorage.get.mockImplementation(() => {
      throw new Error('boom')
    })
    expect(getDefaultPagingSize()).toBe(10)
    expect(mockedLogger.error).toHaveBeenCalled()
  })
})

describe('savePagingSize', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('persists a valid size and dispatches the change event', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')
    savePagingSize(25)
    expect(mockedStorage.set).toHaveBeenCalledWith('gluu.pagingSize', '25')
    expect(dispatchSpy).toHaveBeenCalled()
    dispatchSpy.mockRestore()
  })

  it('rejects a non-positive size', () => {
    savePagingSize(0)
    expect(mockedStorage.set).not.toHaveBeenCalled()
    expect(mockedLogger.warn).toHaveBeenCalled()
  })

  it('rejects a size that is not one of the allowed options', () => {
    savePagingSize(7)
    expect(mockedStorage.set).not.toHaveBeenCalled()
    expect(mockedLogger.warn).toHaveBeenCalled()
  })

  it('floors a fractional valid size before persisting', () => {
    savePagingSize(25.9)
    expect(mockedStorage.set).toHaveBeenCalledWith('gluu.pagingSize', '25')
  })
})
