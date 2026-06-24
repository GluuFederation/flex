import React from 'react'
import { render, screen } from '@testing-library/react'
import { useFormik } from 'formik'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CacheInMemory from 'Plugins/services/Components/CacheInMemory'
import type { CacheFormValues } from 'Plugins/services/Components/types'

const classes: Record<string, string> = {
  sectionGrid: 'sectionGrid',
  fieldItem: 'fieldItem',
}

const mockInMemoryConfig: CacheFormValues = {
  cacheProviderType: 'IN_MEMORY',
  memoryDefaultPutExpiration: 60,
}

type HarnessProps = {
  disabled?: boolean
}

const Harness = ({ disabled }: HarnessProps) => {
  const formik = useFormik<CacheFormValues>({
    initialValues: mockInMemoryConfig,
    onSubmit: () => {},
  })
  return <CacheInMemory formik={formik} classes={classes} isDark={false} disabled={disabled} />
}

const renderHarness = (props: HarnessProps = {}) =>
  render(
    <AppTestWrapper>
      <Harness {...props} />
    </AppTestWrapper>,
  )

describe('CacheInMemory', () => {
  it('renders the default put expiration field', () => {
    renderHarness()
    expect(screen.getByTestId('memoryDefaultPutExpiration')).toBeInTheDocument()
  })

  it('populates the field value from formik initialValues', () => {
    renderHarness()
    expect(screen.getByTestId('memoryDefaultPutExpiration')).toHaveValue(60)
  })

  it('renders the field enabled when not disabled', () => {
    renderHarness()
    expect(screen.getByTestId('memoryDefaultPutExpiration')).not.toBeDisabled()
  })

  it('disables the field when disabled is true', () => {
    renderHarness({ disabled: true })
    expect(screen.getByTestId('memoryDefaultPutExpiration')).toBeDisabled()
  })
})
