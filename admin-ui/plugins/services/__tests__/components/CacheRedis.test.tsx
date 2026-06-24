import React from 'react'
import { render, screen } from '@testing-library/react'
import { useFormik } from 'formik'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CacheRedis from 'Plugins/services/Components/CacheRedis'
import type { CacheFormValues } from 'Plugins/services/Components/types'

const classes: Record<string, string> = {
  sectionGrid: 'sectionGrid',
  fieldItem: 'fieldItem',
}

const mockRedisConfig: CacheFormValues = {
  cacheProviderType: 'REDIS',
  redisProviderType: 'STANDALONE',
  servers: 'localhost:6379',
  password: 'secret',
  sentinelMasterGroupName: 'masterGroup',
  sslTrustStoreFilePath: '/etc/certs/redis.jks',
  redisDefaultPutExpiration: 60,
  useSSL: true,
  maxIdleConnections: 10,
  maxTotalConnections: 500,
  connectionTimeout: 3000,
  soTimeout: 3000,
  maxRetryAttempts: 5,
}

type HarnessProps = {
  disabled?: boolean
}

const Harness = ({ disabled }: HarnessProps) => {
  const formik = useFormik<CacheFormValues>({
    initialValues: mockRedisConfig,
    onSubmit: () => {},
  })
  return <CacheRedis formik={formik} classes={classes} isDark={false} disabled={disabled} />
}

const renderHarness = (props: HarnessProps = {}) =>
  render(
    <AppTestWrapper>
      <Harness {...props} />
    </AppTestWrapper>,
  )

describe('CacheRedis', () => {
  it('renders its key fields', () => {
    renderHarness()
    expect(screen.getByTestId('servers')).toBeInTheDocument()
    expect(screen.getByTestId('password')).toBeInTheDocument()
    expect(screen.getByTestId('maxRetryAttempts')).toBeInTheDocument()
    expect(document.querySelector('select[name="redisProviderType"]')).toBeInTheDocument()
  })

  it('populates field values from formik initialValues', () => {
    renderHarness()
    expect(screen.getByTestId('servers')).toHaveValue('localhost:6379')
    expect(screen.getByTestId('password')).toHaveValue('secret')
    expect(screen.getByTestId('maxRetryAttempts')).toHaveValue(5)
  })

  it('renders the useSSL toggle as checked from formik values', () => {
    renderHarness()
    const toggle = document.querySelector('input#useSSL[type="checkbox"]') as HTMLInputElement
    expect(toggle).toBeTruthy()
    expect(toggle.checked).toBe(true)
  })

  it('renders fields enabled when not disabled', () => {
    renderHarness()
    expect(screen.getByTestId('servers')).not.toBeDisabled()
  })

  it('disables fields when disabled is true', () => {
    renderHarness({ disabled: true })
    expect(screen.getByTestId('servers')).toBeDisabled()
    expect(screen.getByTestId('password')).toBeDisabled()
  })
})
