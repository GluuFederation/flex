import {
  LOGGING_LEVELS,
  PROTECTION_MODES,
  DOC_CATEGORY,
  AUDIT_RESOURCE,
} from 'Plugins/scim/helper/constants'

describe('SCIM constants', () => {
  describe('LOGGING_LEVELS', () => {
    it('contains expected logging levels', () => {
      expect(LOGGING_LEVELS).toEqual(['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'])
    })

    it('has 7 levels', () => {
      expect(LOGGING_LEVELS).toHaveLength(7)
    })
  })

  describe('PROTECTION_MODES', () => {
    it('contains OAUTH and BYPASS', () => {
      expect(PROTECTION_MODES).toContain('OAUTH')
      expect(PROTECTION_MODES).toContain('BYPASS')
    })

    it('has 2 modes', () => {
      expect(PROTECTION_MODES).toHaveLength(2)
    })
  })

  describe('DOC_CATEGORY', () => {
    it('is scim', () => {
      expect(DOC_CATEGORY).toBe('scim')
    })
  })

  describe('AUDIT_RESOURCE', () => {
    it('is update_scim_config', () => {
      expect(AUDIT_RESOURCE).toBe('update_scim_config')
    })
  })
})
