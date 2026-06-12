/** @jest-environment node */
import { deflateRawSync } from 'node:zlib'
import { readZip } from '../zip'

const STORED_CONTENT = '{"stored":true}'
const DEFLATED_CONTENT = 'deflate me '.repeat(50)
const NESTED_CONTENT = '{"inner":1}'

type Entry = { name: string; content: string; method: 'store' | 'deflate' }

const buildLocalHeader = (entry: Entry, data: Uint8Array, raw: Uint8Array, name: Uint8Array) => {
  const method = entry.method === 'store' || raw.length === 0 ? 0 : 8
  const header = new Uint8Array(30 + name.length + data.length)
  const view = new DataView(header.buffer)
  view.setUint32(0, 0x04034b50, true)
  view.setUint16(4, 20, true)
  view.setUint16(8, method, true)
  view.setUint32(18, data.length, true)
  view.setUint32(22, raw.length, true)
  view.setUint16(26, name.length, true)
  header.set(name, 30)
  header.set(data, 30 + name.length)
  return header
}

const buildCentralHeader = (
  entry: Entry,
  data: Uint8Array,
  raw: Uint8Array,
  name: Uint8Array,
  localOffset: number,
) => {
  const method = entry.method === 'store' || raw.length === 0 ? 0 : 8
  const header = new Uint8Array(46 + name.length)
  const view = new DataView(header.buffer)
  view.setUint32(0, 0x02014b50, true)
  view.setUint16(4, 20, true)
  view.setUint16(6, 20, true)
  view.setUint16(10, method, true)
  view.setUint32(20, data.length, true)
  view.setUint32(24, raw.length, true)
  view.setUint16(28, name.length, true)
  view.setUint32(42, localOffset, true)
  header.set(name, 46)
  return header
}

const buildZip = (entries: Entry[]): Uint8Array => {
  const encoder = new TextEncoder()
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0
  for (const entry of entries) {
    const name = encoder.encode(entry.name)
    const raw = encoder.encode(entry.content)
    const data =
      entry.method === 'store' || raw.length === 0 ? raw : new Uint8Array(deflateRawSync(raw))
    const local = buildLocalHeader(entry, data, raw, name)
    locals.push(local)
    centrals.push(buildCentralHeader(entry, data, raw, name, offset))
    offset += local.length
  }

  const centralSize = centrals.reduce((sum, header) => sum + header.length, 0)
  const eocd = new Uint8Array(22)
  const eocdView = new DataView(eocd.buffer)
  eocdView.setUint32(0, 0x06054b50, true)
  eocdView.setUint16(8, entries.length, true)
  eocdView.setUint16(10, entries.length, true)
  eocdView.setUint32(12, centralSize, true)
  eocdView.setUint32(16, offset, true)

  const out = new Uint8Array(offset + centralSize + eocd.length)
  let cursor = 0
  for (const local of locals) {
    out.set(local, cursor)
    cursor += local.length
  }
  for (const central of centrals) {
    out.set(central, cursor)
    cursor += central.length
  }
  out.set(eocd, cursor)
  return out
}

const FIXTURE: Entry[] = [
  { name: 'stored.json', content: STORED_CONTENT, method: 'store' },
  { name: 'deflated.txt', content: DEFLATED_CONTENT, method: 'deflate' },
  { name: 'nested/', content: '', method: 'store' },
  { name: 'nested/inner.json', content: NESTED_CONTENT, method: 'deflate' },
]

describe('readZip', () => {
  it('lists every entry including directories', async () => {
    const archive = await readZip(buildZip(FIXTURE))
    expect(Object.keys(archive.files).sort()).toEqual([
      'deflated.txt',
      'nested/',
      'nested/inner.json',
      'stored.json',
    ])
    expect(archive.files['nested/'].dir).toBe(true)
    expect(archive.files['stored.json'].dir).toBe(false)
  })

  it('reads stored (uncompressed) entries', async () => {
    const archive = await readZip(buildZip(FIXTURE))
    expect(await archive.files['stored.json'].text()).toBe(STORED_CONTENT)
  })

  it('reads deflate-compressed entries', async () => {
    const archive = await readZip(buildZip(FIXTURE))
    expect(await archive.files['deflated.txt'].text()).toBe(DEFLATED_CONTENT)
    expect(await archive.files['nested/inner.json'].text()).toBe(NESTED_CONTENT)
  })

  it('returns an empty string for directory entries', async () => {
    const archive = await readZip(buildZip(FIXTURE))
    expect(await archive.files['nested/'].text()).toBe('')
  })

  it('accepts a Blob input', async () => {
    const blob = new Blob([new Uint8Array(buildZip(FIXTURE))])
    const archive = await readZip(blob)
    expect(await archive.files['stored.json'].text()).toBe(STORED_CONTENT)
  })

  it('throws on input that is not a zip', async () => {
    await expect(readZip(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]))).rejects.toThrow(
      'not a valid zip',
    )
  })
})
