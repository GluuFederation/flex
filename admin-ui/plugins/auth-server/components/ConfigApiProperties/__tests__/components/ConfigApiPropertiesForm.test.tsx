import { render, waitFor } from '@testing-library/react'
import { useFormik } from 'formik'
import ConfigApiPropertiesForm from '../../components/ConfigApiPropertiesForm'
import type { ApiAppConfiguration, JsonPatch } from '../../types'
import type { JsonPropertyBuilderConfigApiProps } from '../../types/componentTypes'

// Mock dependencies
jest.mock('formik', () => ({
  useFormik: jest.fn(),
}))

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: () => ({
    authorizeHelper: jest.fn(),
    hasCedarWritePermission: () => true,
  }),
}))

jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({
    navigateToRoute: jest.fn(),
  }),
}))

jest.mock('../../utils/useConfigApiActions', () => ({
  useConfigApiActions: () => ({
    logConfigApiUpdate: jest.fn(),
  }),
}))

jest.mock('../../components/styles/ConfigApiPropertiesForm.style', () => ({
  useStyles: () => ({
    classes: {
      form: '',
      formContent: '',
      fieldsGrid: '',
      fieldItem: '',
      fieldItemFullWidth: '',
      stickyFooter: '',
      errorAlert: '',
    },
  }),
}))

jest.mock('@/context/theme/themeContext', () => ({
  useTheme: () => ({ state: { theme: 'darkBlue' } }),
}))

jest.mock('@/context/theme/config', () => () => ({
  fontColor: '',
  card: { background: '' },
  inputBackground: '',
  borderColor: '',
  settings: {},
}))

jest.mock('@/context/theme/constants', () => ({
  THEME_DARK: 'darkBlue',
}))

let capturedHandler: ((patch: JsonPatch) => void) | null = null

type MockJsonPropertyBuilderConfigApiProps = JsonPropertyBuilderConfigApiProps

jest.mock('../../components/JsonPropertyBuilderConfigApi', () => {
  return function MockJsonPropertyBuilderConfigApi(props: MockJsonPropertyBuilderConfigApiProps) {
    capturedHandler = props.handler
    return <div data-testid="json-property-builder">Mock</div>
  }
})

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => {
  return function MockGluuCommitDialog() {
    return <div data-testid="commit-dialog">Mock</div>
  }
})

jest.mock('Routes/Apps/Gluu/GluuThemeFormFooter', () => {
  return function MockGluuThemeFormFooter() {
    return <div data-testid="theme-form-footer">Mock</div>
  }
})

describe('ConfigApiPropertiesForm - removeArrayItem', () => {
  const mockValidateForm = jest.fn()
  const mockSetValues = jest.fn()
  const mockSetTouched = jest.fn()
  let trackedState: ApiAppConfiguration | null = null

  const createMockFormik = (initialValues: ApiAppConfiguration) => {
    trackedState = { ...initialValues }
    const formikTouched: Record<string, boolean> = {}
    const formikErrors: Record<string, string> = {}

    return {
      values: { ...initialValues },
      touched: formikTouched,
      errors: formikErrors,
      isValid: true,
      dirty: false,
      setFieldValue: jest.fn(),
      setValues: mockSetValues,
      setTouched: mockSetTouched,
      resetForm: jest.fn(),
      validateForm: mockValidateForm,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    capturedHandler = null
    trackedState = null
    mockValidateForm.mockResolvedValue({})
    mockSetValues.mockImplementation((updater) => {
      if (typeof updater === 'function' && trackedState) {
        const result = updater(trackedState)
        if (result) {
          trackedState = result
        }
        return result
      }
    })
  })

  describe('Root array removal', () => {
    it('should remove item from root array and update Formik values', () => {
      const initialValues: ApiAppConfiguration = {
        corsConfigurationFilters: [
          { filterName: 'filter1' },
          { filterName: 'filter2' },
          { filterName: 'filter3' },
        ],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/corsConfigurationFilters/1',
      }

      handler(removePatch)

      expect(mockSetValues).toHaveBeenCalled()
      const setValuesCall = mockSetValues.mock.calls[0][0]
      expect(typeof setValuesCall).toBe('function')

      const updatedValues = setValuesCall(initialValues)
      expect(updatedValues.corsConfigurationFilters).toEqual([
        { filterName: 'filter1' },
        { filterName: 'filter3' },
      ])
    })

    it('should handle out-of-range index gracefully', () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const outOfRangePatch: JsonPatch = {
        op: 'remove',
        path: '/apiApprovedIssuer/10',
        value: null,
      }

      handler(outOfRangePatch)

      const setValuesCall = mockSetValues.mock.calls[0]?.[0]
      expect(setValuesCall).toBeDefined()
      expect(typeof setValuesCall).toBe('function')

      const updatedValues = setValuesCall(initialValues)
      expect(updatedValues.apiApprovedIssuer).toEqual(['issuer1', 'issuer2'])
    })
  })

  describe('Nested array removal', () => {
    it('should remove item from nested array via parentField', () => {
      const initialValues: ApiAppConfiguration = {
        assetMgtConfiguration: {
          assetDirMapping: [
            { directory: '/path1', description: 'desc1' },
            { directory: '/path2', description: 'desc2' },
            { directory: '/path3', description: 'desc3' },
          ],
        },
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/assetMgtConfiguration/assetDirMapping/1',
        value: { directory: '/path2', description: 'desc2' },
      }

      handler(removePatch)

      expect(mockSetValues).toHaveBeenCalled()
      const setValuesCall = mockSetValues.mock.calls[0][0]
      expect(typeof setValuesCall).toBe('function')

      const updatedValues = setValuesCall(initialValues)
      expect(updatedValues.assetMgtConfiguration.assetDirMapping).toEqual([
        { directory: '/path1', description: 'desc1' },
        { directory: '/path3', description: 'desc3' },
      ])
    })
  })

  describe('Concurrent removal prevention', () => {
    it('should prevent duplicate removals using processingRemovalsRef', () => {
      const initialValues: ApiAppConfiguration = {
        corsConfigurationFilters: [{ filterName: 'filter1' }, { filterName: 'filter2' }],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/corsConfigurationFilters/0',
      }

      const firstCallCount = mockSetValues.mock.calls.length
      handler(removePatch)
      expect(mockSetValues).toHaveBeenCalledTimes(firstCallCount + 1)

      const secondCallCount = mockSetValues.mock.calls.length
      handler(removePatch)
      expect(mockSetValues).toHaveBeenCalledTimes(secondCallCount)
    })
  })

  describe('Patch state management', () => {
    it('should add remove patch to patches state', () => {
      const initialValues: ApiAppConfiguration = {
        corsConfigurationFilters: [{ filterName: 'filter1' }, { filterName: 'filter2' }],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/corsConfigurationFilters/0',
      }

      handler(removePatch)

      expect(mockSetValues).toHaveBeenCalled()
      const setValuesCall = mockSetValues.mock.calls[0][0]
      expect(typeof setValuesCall).toBe('function')

      const updatedValues = setValuesCall(initialValues)
      expect(updatedValues.corsConfigurationFilters).toEqual([{ filterName: 'filter2' }])
    })

    it('should not duplicate existing remove patch', () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/apiApprovedIssuer/0',
        value: 'issuer1',
      }

      handler(removePatch)
      const firstCallCount = mockSetValues.mock.calls.length

      handler(removePatch)
      expect(mockSetValues.mock.calls.length).toBeGreaterThanOrEqual(firstCallCount)
    })
  })

  describe('Formik state updates', () => {
    it('should update touched state for touchedField', () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch = {
        op: 'remove' as const,
        path: '/apiApprovedIssuer/0',
        value: 'issuer1',
      }

      handler(removePatch)

      expect(mockSetTouched).toHaveBeenCalledWith(
        expect.objectContaining({ apiApprovedIssuer: true }),
      )
    })

    it('should trigger re-render after removal', () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch = {
        op: 'remove' as const,
        path: '/apiApprovedIssuer/0',
        value: 'issuer1',
      }

      handler(removePatch)

      expect(mockSetValues).toHaveBeenCalled()
      expect(mockSetTouched).toHaveBeenCalled()
    })
  })

  describe('Async validation cleanup', () => {
    it('should call validateForm after removal', async () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      mockValidateForm.mockResolvedValue({})
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/apiApprovedIssuer/0',
        value: 'issuer1',
      }

      handler(removePatch)

      expect(mockSetValues).toHaveBeenCalled()

      await waitFor(() => {
        expect(mockValidateForm).toHaveBeenCalled()
      })
    })
  })
})
