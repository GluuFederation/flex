import React from 'react'
import { render, screen } from '@testing-library/react'
import { useFormik } from 'formik'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CacheNative from 'Plugins/services/Components/CacheNative'
import type { CacheFormValues } from 'Plugins/services/Components/types'

const classes: Record<string, string> = {
  sectionGrid: 'sectionGrid',
  fieldItem: 'fieldItem',
}

const mockNativeConfig: CacheFormValues = {
  cacheProviderType: 'NATIVE_PERSISTENCE',
  nativeDefaultPutExpiration: 60,
  defaultCleanupBatchSize: 25,
  deleteExpiredOnGetRequest: true,
}

type HarnessProps = {
  disabled?: boolean
}

const Harness = ({ disabled }: HarnessProps) => {
  const formik = useFormik<CacheFormValues>({
    initialValues: mockNativeConfig,
    onSubmit: () => {},
  })
  return <CacheNative formik={formik} classes={classes} isDark={false} disabled={disabled} />
}

const renderHarness = (props: HarnessProps = {}) =>
  render(
    <AppTestWrapper>
      <Harness {...props} />
    </AppTestWrapper>,
  )

describe('CacheNative', () => {
  it('renders its key fields', () => {
    renderHarness()
    expect(screen.getByTestId('nativeDefaultPutExpiration')).toBeInTheDocument()
    expect(screen.getByTestId('defaultCleanupBatchSize')).toBeInTheDocument()
  })

  it('populates field values from formik initialValues', () => {
    renderHarness()
    expect(screen.getByTestId('nativeDefaultPutExpiration')).toHaveValue(60)
    expect(screen.getByTestId('defaultCleanupBatchSize')).toHaveValue(25)
  })

  it('renders the deleteExpiredOnGetRequest toggle as checked from formik values', () => {
    renderHarness()
    const toggle = document.querySelector(
      'input#deleteExpiredOnGetRequest[type="checkbox"]',
    ) as HTMLInputElement
    expect(toggle).toBeTruthy()
    expect(toggle.checked).toBe(true)
  })

  it('renders fields enabled when not disabled', () => {
    renderHarness()
    expect(screen.getByTestId('nativeDefaultPutExpiration')).not.toBeDisabled()
  })

  it('disables fields when disabled is true', () => {
    renderHarness({ disabled: true })
    expect(screen.getByTestId('nativeDefaultPutExpiration')).toBeDisabled()
    expect(screen.getByTestId('defaultCleanupBatchSize')).toBeDisabled()
  })
})
