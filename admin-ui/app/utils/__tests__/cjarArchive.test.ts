import {
  buildArchiveTree,
  editorModeFor,
  entryToText,
  formatBytes,
  isTextEntry,
  normalizeArchivePath,
  readArchive,
  textToBytes,
  writeArchive,
  type ArchiveEntry,
} from '../cjarArchive'

const entry = (path: string, text: string): ArchiveEntry => ({ path, bytes: textToBytes(text) })

describe('isTextEntry', () => {
  it.each([
    ['policies/allow.cedar', true],
    ['schema.json', true],
    ['META-INF/MANIFEST.MF', true],
    ['notes.md', true],
    ['image.png', false],
    ['blob', false],
  ])('classifies %s as text=%s', (path, expected) => {
    expect(isTextEntry(path)).toBe(expected)
  })
})

describe('editorModeFor', () => {
  it.each([
    ['schema.json', 'json'],
    ['config.xml', 'xml'],
    ['values.yaml', 'yaml'],
    // Ace has no Cedar mode, so policies fall back to plain text.
    ['policies/allow.cedar', 'text'],
  ])('maps %s to %s', (path, mode) => {
    expect(editorModeFor(path)).toBe(mode)
  })
})

describe('normalizeArchivePath', () => {
  it.each([
    ['/policies//new.cedar', 'policies/new.cedar'],
    ['  policies / new.cedar ', 'policies/new.cedar'],
    ['///', ''],
  ])('normalizes %p to %p', (input, expected) => {
    expect(normalizeArchivePath(input)).toBe(expected)
  })
})

describe('formatBytes', () => {
  it.each([
    [0, '0 B'],
    [-5, '0 B'],
    [512, '512 B'],
    [2048, '2.0 KB'],
    [1024 * 1024 * 3, '3.0 MB'],
  ])('formats %i as %s', (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected)
  })
})

describe('buildArchiveTree', () => {
  it('synthesizes intermediate directories from file paths', () => {
    const tree = buildArchiveTree([entry('policies/nested/allow.cedar', 'x')])
    expect(tree).toHaveLength(1)
    expect(tree[0]).toMatchObject({ name: 'policies', isDirectory: true })
    expect(tree[0].children[0]).toMatchObject({ name: 'nested', isDirectory: true })
    expect(tree[0].children[0].children[0]).toMatchObject({
      name: 'allow.cedar',
      isDirectory: false,
      path: 'policies/nested/allow.cedar',
    })
  })

  it('sorts directories before files, each alphabetically', () => {
    const tree = buildArchiveTree([
      entry('zeta.json', '{}'),
      entry('alpha.json', '{}'),
      entry('policies/b.cedar', 'b'),
      entry('entities/a.json', '{}'),
    ])
    expect(tree.map((node) => node.name)).toEqual([
      'entities',
      'policies',
      'alpha.json',
      'zeta.json',
    ])
  })

  it('returns an empty tree for no entries', () => {
    expect(buildArchiveTree([])).toEqual([])
  })
})

describe('archive round-trip', () => {
  const entries = [
    entry('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\n'),
    entry('policies/allow.cedar', 'permit(principal, action, resource);'),
    entry('schema.json', JSON.stringify({ cedar: 'schema' })),
  ]

  it('reads back exactly what was written', async () => {
    const packed = await writeArchive(entries)
    const unpacked = await readArchive(packed)

    expect(unpacked.map((item) => item.path)).toEqual([
      'META-INF/MANIFEST.MF',
      'policies/allow.cedar',
      'schema.json',
    ])
    for (const original of entries) {
      const found = unpacked.find((item) => item.path === original.path)
      expect(found).toBeDefined()
      expect(entryToText(found as ArchiveEntry)).toBe(entryToText(original))
    }
  })

  it('survives an edit to one file', async () => {
    const packed = await writeArchive(entries)
    const unpacked = await readArchive(packed)
    const edited = unpacked.map((item) =>
      item.path === 'policies/allow.cedar' ? { ...item, bytes: textToBytes('forbid();') } : item,
    )

    const repacked = await readArchive(await writeArchive(edited))
    const policy = repacked.find((item) => item.path === 'policies/allow.cedar')
    expect(entryToText(policy as ArchiveEntry)).toBe('forbid();')
    // The untouched files must come back byte-identical.
    const manifest = repacked.find((item) => item.path === 'META-INF/MANIFEST.MF')
    expect(entryToText(manifest as ArchiveEntry)).toBe('Manifest-Version: 1.0\n')
  })

  it('handles an empty archive and empty files', async () => {
    expect(await readArchive(await writeArchive([]))).toEqual([])
    const withEmpty = await readArchive(await writeArchive([entry('empty.cedar', '')]))
    expect(withEmpty).toHaveLength(1)
    expect(entryToText(withEmpty[0])).toBe('')
  })

  it('preserves non-ASCII content', async () => {
    const unicode = [entry('notes.md', '# Política — 政策 ✅')]
    const unpacked = await readArchive(await writeArchive(unicode))
    expect(entryToText(unpacked[0])).toBe('# Política — 政策 ✅')
  })

  it('rejects data that is not an archive', async () => {
    await expect(readArchive(textToBytes('definitely not a zip'))).rejects.toThrow(
      /not a valid archive/i,
    )
  })
})
