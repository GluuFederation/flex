import { buildSettingsInitialValues } from '../settings'
import { CEDARLING_LOG_TYPE } from '@/cedarling/constants'
import type { AppConfigResponse } from 'JansConfigApi'

describe('settings helper', () => {
  describe('buildSettingsInitialValues', () => {
    it('returns defaults when config is undefined', () => {
      const result = buildSettingsInitialValues()
      expect(result.sessionTimeoutInMins).toBe('')
      expect(result.acrValues).toBe('')
      expect(result.cedarlingLogType).toBe(CEDARLING_LOG_TYPE.OFF)
      expect(result.additionalParameters).toEqual([])
    })

    it('maps populated config fields', () => {
      const config: AppConfigResponse = {
        sessionTimeoutInMins: 30,
        acrValues: 'simple_password_auth',
        cedarlingLogType: CEDARLING_LOG_TYPE.STD_OUT,
      }
      const result = buildSettingsInitialValues(config)
      expect(result.sessionTimeoutInMins).toBe(30)
      expect(result.acrValues).toBe('simple_password_auth')
      expect(result.cedarlingLogType).toBe(CEDARLING_LOG_TYPE.STD_OUT)
    })

    it('defaults cedarlingLogType to OFF when the config omits it', () => {
      const config: AppConfigResponse = { sessionTimeoutInMins: 10 }
      expect(buildSettingsInitialValues(config).cedarlingLogType).toBe(CEDARLING_LOG_TYPE.OFF)
    })

    it('keeps additional parameters that have a key or a value and assigns ids', () => {
      const config: AppConfigResponse = {
        additionalParameters: [
          { key: 'a', value: '1' },
          { key: '', value: '' },
          { key: 'b', value: '' },
        ],
      }
      const result = buildSettingsInitialValues(config)
      expect(result.additionalParameters).toHaveLength(2)
      expect(result.additionalParameters[0].key).toBe('a')
      expect(result.additionalParameters[0].value).toBe('1')
      expect(result.additionalParameters[1].key).toBe('b')
      expect(typeof result.additionalParameters[0].id).toBe('string')
      expect(result.additionalParameters[0].id).not.toBe(result.additionalParameters[1].id)
    })

    it('filters out parameters with only whitespace', () => {
      const config: AppConfigResponse = {
        additionalParameters: [{ key: '   ', value: '  ' }],
      }
      expect(buildSettingsInitialValues(config).additionalParameters).toEqual([])
    })
  })
})
