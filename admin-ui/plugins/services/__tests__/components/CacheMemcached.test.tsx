import React from 'react'
import { render, screen } from '@testing-library/react'
import { useFormik } from 'formik'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CacheMemcached from 'Plugins/services/Components/CacheMemcached'
import type { CacheFormValues } from 'Plugins/services/Components/types'

const classes: Record<string, string> = {
  sectionGrid: 'sectionGrid',
  fieldItem: 'fieldItem',
}

const mockMemcachedConfig: CacheFormValues = {
  cacheProviderType: 'MEMCACHED',
  memCacheServers: 'localhost:11211',
  maxOperationQueueLength: 100000,
  bufferSize: 32768,
  memDefaultPutExpiration: 60,
  connectionFactoryType: 'DEFAULT',
}

type HarnessProps = {
  disabled?: boolean
}

const Harness = ({ disabled }: HarnessProps) => {
  const formik = useFormik<CacheFormValues>({
    initialValues: mockMemcachedConfig,
    onSubmit: () => {},
  })
  return <CacheMemcached formik={formik} classes={classes} isDark={false} disabled={disabled} />
}

const renderHarness = (props: HarnessProps = {}) =>
  render(
    <AppTestWrapper>
      <Harness {...props} />
    </AppTestWrapper>,
  )

describe('CacheMemcached', () => {
  it('renders its key fields', () => {
    renderHarness()
    expect(screen.getByTestId('memCacheServers')).toBeInTheDocument()
    expect(screen.getByTestId('maxOperationQueueLength')).toBeInTheDocument()
    expect(screen.getByTestId('bufferSize')).toBeInTheDocument()
    expect(document.querySelector('select[name="connectionFactoryType"]')).toBeInTheDocument()
  })

  it('populates field values from formik initialValues', () => {
    renderHarness()
    expect(screen.getByTestId('memCacheServers')).toHaveValue('localhost:11211')
    expect(screen.getByTestId('maxOperationQueueLength')).toHaveValue(100000)
    expect(screen.getByTestId('memDefaultPutExpiration')).toHaveValue(60)
  })

  it('renders fields enabled when not disabled', () => {
    renderHarness()
    expect(screen.getByTestId('memCacheServers')).not.toBeDisabled()
  })

  it('disables fields when disabled is true', () => {
    renderHarness({ disabled: true })
    expect(screen.getByTestId('memCacheServers')).toBeDisabled()
    expect(screen.getByTestId('bufferSize')).toBeDisabled()
  })
})
