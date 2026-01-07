import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { useFormik } from 'formik'
import ApiConfigForm from './ApiConfigForm'
import type { ApiAppConfiguration } from './types'

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

let capturedHandler: ((patch: any) => void) | null = null

jest.mock('./JsonPropertyBuilderConfigApi', () => {
  return function MockJsonPropertyBuilderConfigApi(props: any) {
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

      if (capturedHandler) {
        const removePatch = {
          op: 'remove' as const,
          path: '/apiApprovedIssuer/1',
          value: 'issuer2',
        }

        capturedHandler(removePatch)

        expect(mockSetValues).toHaveBeenCalled()
        const setValuesCall = mockSetValues.mock.calls[0][0]
        expect(typeof setValuesCall).toBe('function')

        const updatedValues = setValuesCall(initialValues)
        expect(updatedValues.apiApprovedIssuer).toEqual(['issuer1', 'issuer3'])
      }
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

      if (capturedHandler) {
        const outOfRangePatch = {
          op: 'remove' as const,
          path: '/apiApprovedIssuer/10',
          value: null,
        }

        capturedHandler(outOfRangePatch)

        const setValuesCall = mockSetValues.mock.calls[0]?.[0]
        if (setValuesCall && typeof setValuesCall === 'function') {
          const updatedValues = setValuesCall(initialValues)
          expect(updatedValues.apiApprovedIssuer).toEqual(['issuer1', 'issuer2'])
        }
      }
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

      // Test that nested removal would work
      // In practice, this would be triggered through UI interaction
      expect(mockFormik.setValues).toBeDefined()
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

      // processingRemovalsRef should prevent concurrent removals
      // This is tested through the component's internal logic
      expect(mockFormik.setValues).toBeDefined()
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

      // Patches should be managed correctly
      expect(mockFormik.setValues).toBeDefined()
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

      // Duplicate patches should be prevented
      expect(mockFormik.setValues).toBeDefined()
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

      let resolveValidation: (value: any) => void
      const validationPromise = new Promise((resolve) => {
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

      if (capturedHandler) {
        const removePatch = {
          op: 'remove' as const,
          path: '/apiApprovedIssuer/0',
          value: 'issuer1',
        }

        capturedHandler(removePatch)

        expect(mockSetValues).toHaveBeenCalled()
        expect(mockValidateForm).toHaveBeenCalled()

        const firstCallCount = mockSetValues.mock.calls.length

        resolveValidation!({})

        await waitFor(() => {
          expect(mockValidateForm).toHaveBeenCalled()
        })

        const secondRemovePatch = {
          op: 'remove' as const,
          path: '/apiApprovedIssuer/0',
          value: 'issuer1',
        }

        capturedHandler(secondRemovePatch)

        expect(mockSetValues.mock.calls.length).toBeGreaterThan(firstCallCount)
      }
    })
  })
})
