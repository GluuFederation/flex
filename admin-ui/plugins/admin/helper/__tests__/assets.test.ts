import { buildAssetInitialValues } from '../assets'
import type { Document } from '../../components/Assets/types'

describe('assets helper', () => {
  describe('buildAssetInitialValues', () => {
    it('returns empty defaults when given no asset', () => {
      const result = buildAssetInitialValues()
      expect(result).toEqual({
        creationDate: '',
        document: '',
        fileName: '',
        enabled: false,
        description: '',
        service: [],
        inum: '',
        dn: '',
        baseDn: '',
      })
    })

    it('maps a full Document into form values', () => {
      const doc: Document = {
        dn: 'dn-1',
        inum: 'inum-1',
        fileName: 'logo.png',
        description: 'a logo',
        document: 'data',
        creationDate: '2026-01-01',
        service: 'jans-auth',
        enabled: true,
        baseDn: 'base-1',
      }
      const result = buildAssetInitialValues(doc)
      expect(result.fileName).toBe('logo.png')
      expect(result.description).toBe('a logo')
      expect(result.document).toBe('data')
      expect(result.enabled).toBe(true)
      expect(result.service).toEqual(['jans-auth'])
      expect(result.inum).toBe('inum-1')
      expect(result.dn).toBe('dn-1')
      expect(result.baseDn).toBe('base-1')
      expect(result.creationDate).toBe('2026-01-01')
    })

    it('reads the service from jansService when service is absent', () => {
      const result = buildAssetInitialValues({ jansService: 'fido' })
      expect(result.service).toEqual(['fido'])
    })

    it('reads the service from the first jansModuleProperty entry', () => {
      const result = buildAssetInitialValues({ jansModuleProperty: ['scim'] })
      expect(result.service).toEqual(['scim'])
    })

    it('falls back to displayName for the file name', () => {
      const result = buildAssetInitialValues({ displayName: 'display.png' })
      expect(result.fileName).toBe('display.png')
    })

    it('reads enabled from jansEnabled', () => {
      const result = buildAssetInitialValues({ jansEnabled: true })
      expect(result.enabled).toBe(true)
    })

    it('preserves a File document instance', () => {
      const file = new File(['x'], 'f.png')
      const result = buildAssetInitialValues({ document: file })
      expect(result.document).toBe(file)
    })

    it('returns empty service array when no service field present', () => {
      const result = buildAssetInitialValues({ fileName: 'x.png' })
      expect(result.service).toEqual([])
    })
  })
})
