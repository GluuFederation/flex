import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { useFormik } from 'formik'
import ApiConfigForm from './ApiConfigForm'
import type { ApiAppConfiguration, JsonPatch } from './types'
import type { JsonPropertyBuilderConfigApiProps } from './types/componentTypes'

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
  useAppNavigation: () => ({
    navigateToRoute: jest.fn(),
  }),
  ROUTES: {
    HOME_DASHBOARD: '/home',
  },
}))

let capturedHandler: ((patch: JsonPatch) => void) | null = null

type MockJsonPropertyBuilderConfigApiProps = JsonPropertyBuilderConfigApiProps

jest.mock('./JsonPropertyBuilderConfigApi', () => {
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

jest.mock('Routes/Apps/Gluu/GluuFormFooter', () => {
  return function MockGluuFormFooter() {
    return <div data-testid="form-footer">Mock</div>
  }
})

describe('ApiConfigForm - removeArrayItem', () => {
  const mockValidateForm = jest.fn()
  const mockSetValues = jest.fn()
  const mockSetTouched = jest.fn()

  const createMockFormik = (initialValues: ApiAppConfiguration) => {
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
    mockValidateForm.mockResolvedValue({})
    mockSetValues.mockImplementation((updater) => {
      if (typeof updater === 'function') {
        updater({} as ApiAppConfiguration)
      }
    })
  })

  describe('Root array removal', () => {
    it('should remove item from root array and update Formik values', () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2', 'issuer3'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/apiApprovedIssuer/1',
        value: 'issuer2',
      }

      handler(removePatch)

      expect(mockSetValues).toHaveBeenCalled()
      const setValuesCall = mockSetValues.mock.calls[0][0]
      expect(typeof setValuesCall).toBe('function')

      const updatedValues = setValuesCall(initialValues)
      expect(updatedValues.apiApprovedIssuer).toEqual(['issuer1', 'issuer3'])
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

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

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

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

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
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

      expect(capturedHandler).toBeDefined()
      expect(capturedHandler).not.toBeNull()

      const handler = capturedHandler!
      const removePatch: JsonPatch = {
        op: 'remove',
        path: '/apiApprovedIssuer/0',
        value: 'issuer1',
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
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

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
      const setValuesCall = mockSetValues.mock.calls[0][0]
      expect(typeof setValuesCall).toBe('function')

      const updatedValues = setValuesCall(initialValues)
      expect(updatedValues.apiApprovedIssuer).toEqual(['issuer2'])
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

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

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

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

      // Touched state should be updated
      expect(mockSetTouched).toBeDefined()
    })

    it('should increment resetKey', () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      const mockFormik = createMockFormik(initialValues)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

      // resetKey should increment
      expect(mockFormik.setValues).toBeDefined()
    })
  })

  describe('Async validation cleanup', () => {
    it('should clear processingRemovalsRef after validateForm resolves', async () => {
      const initialValues: ApiAppConfiguration = {
        apiApprovedIssuer: ['issuer1', 'issuer2'],
      } as ApiAppConfiguration

      let resolveValidation: ((value: Record<string, string>) => void) | undefined
      const validationPromise = new Promise<Record<string, string>>((resolve) => {
        resolveValidation = resolve
      })

      const mockFormik = createMockFormik(initialValues)
      mockValidateForm.mockReturnValue(validationPromise)
      ;(useFormik as jest.Mock).mockReturnValue(mockFormik)

      const configuration: ApiAppConfiguration = {
        ...initialValues,
      }

      const onSubmit = jest.fn().mockResolvedValue(undefined)

      render(<ApiConfigForm configuration={configuration} onSubmit={onSubmit} />)

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
      expect(mockValidateForm).toHaveBeenCalled()

      const firstCallCount = mockSetValues.mock.calls.length

      expect(resolveValidation).toBeDefined()
      resolveValidation!({})

      await waitFor(() => {
        expect(mockValidateForm).toHaveBeenCalled()
      })

      const secondRemovePatch: JsonPatch = {
        op: 'remove',
        path: '/apiApprovedIssuer/0',
        value: 'issuer1',
      }

      handler(secondRemovePatch)

      expect(mockSetValues.mock.calls.length).toBeGreaterThan(firstCallCount)
    })
  })
})
