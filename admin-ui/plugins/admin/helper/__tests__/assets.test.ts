import { buildAssetCommitOperations, buildAssetInitialValues } from '../assets'
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
const labels = {
  document: 'Upload',
  fileName: 'Asset Name',
  service: 'Service',
  description: 'Description',
  enabled: 'Enabled',
}

const existing = buildAssetInitialValues({
  inum: 'a1',
  fileName: 'logo.png',
  description: 'old',
  service: 'jans-auth',
  enabled: true,
  document: 'logo.png',
})

describe('buildAssetCommitOperations', () => {
  it('returns nothing when values are unchanged', () => {
    expect(buildAssetCommitOperations(existing, existing, labels)).toEqual([])
  })

  it('lists only the fields changed on update', () => {
    const current = {
      ...existing,
      description: 'new',
      enabled: false,
      service: ['jans-config-api'],
    }
    expect(buildAssetCommitOperations(existing, current, labels)).toEqual([
      { path: 'service', label: 'Service', value: 'jans-config-api' },
      { path: 'description', label: 'Description', value: 'new' },
      { path: 'enabled', label: 'Enabled', value: false },
    ])
  })

  it('shows the new file name when a file is uploaded', () => {
    const file = new File(['x'], 'banner.png')
    const current = { ...existing, document: file, fileName: 'banner.png' }
    expect(buildAssetCommitOperations(existing, current, labels)).toEqual([
      { path: 'document', label: 'Upload', value: 'banner.png' },
      { path: 'fileName', label: 'Asset Name', value: 'banner.png' },
    ])
  })

  it('lists every filled field when adding', () => {
    const initial = buildAssetInitialValues()
    const file = new File(['x'], 'a.css')
    const current = { ...initial, document: file, fileName: 'a.css', service: ['jans-auth'] }
    expect(buildAssetCommitOperations(initial, current, labels).map((op) => op.path)).toEqual([
      'document',
      'fileName',
      'service',
    ])
  })
})
