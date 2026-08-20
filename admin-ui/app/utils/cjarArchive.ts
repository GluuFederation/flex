/**
 * Minimal ZIP reader/writer for `.cjar` policy stores.
 *
 * A `.cjar` is a zip archive holding Cedar policies, the schema, entity definitions and a manifest.
 * The Archive Explorer reads and rewrites it entirely in the browser — the backend only ever sees
 * the base64 of a complete archive.
 *
 * Implemented against the platform rather than a zip library: the container format is parsed here
 * and DEFLATE is delegated to the browser's native `DecompressionStream` / `CompressionStream`.
 * That keeps admin-ui free of another dependency at the cost of these functions being async.
 */

export type ArchiveEntry = {
  path: string
  bytes: Uint8Array
}

export type ArchiveTreeNode = {
  name: string
  path: string
  isDirectory: boolean
  children: ArchiveTreeNode[]
}

const SIGNATURE = {
  LOCAL_HEADER: 0x04034b50,
  CENTRAL_HEADER: 0x02014b50,
  END_OF_CENTRAL_DIRECTORY: 0x06054b50,
} as const

const COMPRESSION = { STORED: 0, DEFLATE: 8 } as const

const LOCAL_HEADER_SIZE = 30
const CENTRAL_HEADER_SIZE = 46
const EOCD_SIZE = 22
const DEFLATE_RAW = 'deflate-raw'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

/** Extensions we are willing to open in the text editor. Anything else is shown as binary. */
const TEXT_EXTENSIONS = new Set([
  'cedar',
  'json',
  'txt',
  'md',
  'yaml',
  'yml',
  'mf',
  'properties',
  'xml',
  'csv',
])

const TEXT_FILENAMES = new Set(['MANIFEST.MF', 'LICENSE', 'README'])

export const isTextEntry = (path: string): boolean => {
  const name = path.split('/').pop() ?? ''
  if (TEXT_FILENAMES.has(name.toUpperCase())) {
    return true
  }
  const extension = name.includes('.') ? name.split('.').pop()?.toLowerCase() : undefined
  return extension ? TEXT_EXTENSIONS.has(extension) : false
}

/** Ace editor mode for a path, so `.json` and friends get sensible highlighting. */
export const editorModeFor = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase()
  if (extension === 'json') return 'json'
  if (extension === 'xml') return 'xml'
  if (extension === 'yaml' || extension === 'yml') return 'yaml'
  // Ace ships no Cedar mode; plain text keeps the content readable and editable.
  return 'text'
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let value = i
    for (let bit = 0; bit < 8; bit++) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    }
    table[i] = value >>> 0
  }
  return table
})()

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

// These constructors are absent on older engines, so probe before relying on them.
const canDecompress = (): boolean => typeof DecompressionStream === 'function'
const canCompress = (): boolean => typeof CompressionStream === 'function'

const runThroughStream = async (
  data: Uint8Array,
  transform: CompressionStream | DecompressionStream,
): Promise<Uint8Array> => {
  const copy = new Uint8Array(new ArrayBuffer(data.length))
  copy.set(data)
  const stream = new Blob([copy]).stream().pipeThrough(transform)
  const buffer = await new Response(stream).arrayBuffer()
  return new Uint8Array(buffer)
}

const inflateRaw = async (data: Uint8Array): Promise<Uint8Array> => {
  if (!canDecompress()) {
    throw new Error('This browser cannot decompress the policy store archive.')
  }
  return runThroughStream(data, new DecompressionStream(DEFLATE_RAW))
}

const deflateRaw = async (data: Uint8Array): Promise<Uint8Array> =>
  runThroughStream(data, new CompressionStream(DEFLATE_RAW))

const findEndOfCentralDirectory = (view: DataView): number => {
  // The EOCD sits at the end, after an optional comment, so scan backwards for its signature.
  const earliest = Math.max(0, view.byteLength - EOCD_SIZE - 0xffff)
  for (let offset = view.byteLength - EOCD_SIZE; offset >= earliest; offset--) {
    if (view.getUint32(offset, true) === SIGNATURE.END_OF_CENTRAL_DIRECTORY) {
      return offset
    }
  }
  return -1
}

/**
 * Unpacks an archive into a flat, path-sorted entry list. Directory records (entries ending in `/`)
 * are dropped — the tree is derived from file paths instead, so an archive that omits explicit
 * directory records still renders correctly.
 */
export const readArchive = async (bytes: Uint8Array): Promise<ArchiveEntry[]> => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const eocdOffset = findEndOfCentralDirectory(view)
  if (eocdOffset < 0) {
    throw new Error('Not a valid archive: end of central directory not found.')
  }

  const entryCount = view.getUint16(eocdOffset + 10, true)
  let cursor = view.getUint32(eocdOffset + 16, true)
  const entries: ArchiveEntry[] = []

  for (let index = 0; index < entryCount; index++) {
    if (view.getUint32(cursor, true) !== SIGNATURE.CENTRAL_HEADER) {
      throw new Error('Not a valid archive: malformed central directory.')
    }
    const method = view.getUint16(cursor + 10, true)
    const compressedSize = view.getUint32(cursor + 20, true)
    const nameLength = view.getUint16(cursor + 28, true)
    const extraLength = view.getUint16(cursor + 30, true)
    const commentLength = view.getUint16(cursor + 32, true)
    const localOffset = view.getUint32(cursor + 42, true)
    const path = textDecoder.decode(
      bytes.subarray(cursor + CENTRAL_HEADER_SIZE, cursor + CENTRAL_HEADER_SIZE + nameLength),
    )

    if (!path.endsWith('/')) {
      if (view.getUint32(localOffset, true) !== SIGNATURE.LOCAL_HEADER) {
        throw new Error(`Not a valid archive: bad local header for "${path}".`)
      }
      // The local header's name/extra lengths can differ from the central directory's, so the data
      // offset must be computed from the local header itself.
      const localNameLength = view.getUint16(localOffset + 26, true)
      const localExtraLength = view.getUint16(localOffset + 28, true)
      const dataStart = localOffset + LOCAL_HEADER_SIZE + localNameLength + localExtraLength
      const raw = bytes.subarray(dataStart, dataStart + compressedSize)
      entries.push({
        path,
        bytes: method === COMPRESSION.DEFLATE ? await inflateRaw(raw) : raw.slice(),
      })
    }

    cursor += CENTRAL_HEADER_SIZE + nameLength + extraLength + commentLength
  }

  return entries.sort((a, b) => a.path.localeCompare(b.path))
}

type StagedEntry = {
  nameBytes: Uint8Array
  payload: Uint8Array
  method: number
  crc: number
  uncompressedSize: number
  localOffset: number
}

/**
 * Packs entries back into a zip. Deflates when the platform offers `CompressionStream`, and stores
 * uncompressed otherwise — both produce a valid archive, the latter merely a larger one.
 *
 * Returned as an explicitly ArrayBuffer-backed view so the result is a valid BlobPart for download.
 */
export const writeArchive = async (
  entries: readonly ArchiveEntry[],
): Promise<Uint8Array<ArrayBuffer>> => {
  const canDeflate = canCompress()
  const staged: StagedEntry[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = textEncoder.encode(entry.path)
    const deflated = canDeflate && entry.bytes.length > 0 ? await deflateRaw(entry.bytes) : null
    // Only keep the compressed form when it is actually smaller.
    const useDeflate = deflated !== null && deflated.length < entry.bytes.length
    const payload = useDeflate ? deflated : entry.bytes
    staged.push({
      nameBytes,
      payload,
      method: useDeflate ? COMPRESSION.DEFLATE : COMPRESSION.STORED,
      crc: crc32(entry.bytes),
      uncompressedSize: entry.bytes.length,
      localOffset: offset,
    })
    offset += LOCAL_HEADER_SIZE + nameBytes.length + payload.length
  }

  const centralSize = staged.reduce(
    (total, entry) => total + CENTRAL_HEADER_SIZE + entry.nameBytes.length,
    0,
  )
  const output = new Uint8Array(new ArrayBuffer(offset + centralSize + EOCD_SIZE))
  const view = new DataView(output.buffer)

  for (const entry of staged) {
    const at = entry.localOffset
    view.setUint32(at, SIGNATURE.LOCAL_HEADER, true)
    view.setUint16(at + 4, 20, true)
    view.setUint16(at + 6, 0, true)
    view.setUint16(at + 8, entry.method, true)
    view.setUint16(at + 10, 0, true)
    view.setUint16(at + 12, 0, true)
    view.setUint32(at + 14, entry.crc, true)
    view.setUint32(at + 18, entry.payload.length, true)
    view.setUint32(at + 22, entry.uncompressedSize, true)
    view.setUint16(at + 26, entry.nameBytes.length, true)
    view.setUint16(at + 28, 0, true)
    output.set(entry.nameBytes, at + LOCAL_HEADER_SIZE)
    output.set(entry.payload, at + LOCAL_HEADER_SIZE + entry.nameBytes.length)
  }

  let centralCursor = offset
  for (const entry of staged) {
    view.setUint32(centralCursor, SIGNATURE.CENTRAL_HEADER, true)
    view.setUint16(centralCursor + 4, 20, true)
    view.setUint16(centralCursor + 6, 20, true)
    view.setUint16(centralCursor + 8, 0, true)
    view.setUint16(centralCursor + 10, entry.method, true)
    view.setUint16(centralCursor + 12, 0, true)
    view.setUint16(centralCursor + 14, 0, true)
    view.setUint32(centralCursor + 16, entry.crc, true)
    view.setUint32(centralCursor + 20, entry.payload.length, true)
    view.setUint32(centralCursor + 24, entry.uncompressedSize, true)
    view.setUint16(centralCursor + 28, entry.nameBytes.length, true)
    view.setUint16(centralCursor + 30, 0, true)
    view.setUint16(centralCursor + 32, 0, true)
    view.setUint16(centralCursor + 34, 0, true)
    view.setUint16(centralCursor + 36, 0, true)
    view.setUint32(centralCursor + 38, 0, true)
    view.setUint32(centralCursor + 42, entry.localOffset, true)
    output.set(entry.nameBytes, centralCursor + CENTRAL_HEADER_SIZE)
    centralCursor += CENTRAL_HEADER_SIZE + entry.nameBytes.length
  }

  view.setUint32(centralCursor, SIGNATURE.END_OF_CENTRAL_DIRECTORY, true)
  view.setUint16(centralCursor + 4, 0, true)
  view.setUint16(centralCursor + 6, 0, true)
  view.setUint16(centralCursor + 8, staged.length, true)
  view.setUint16(centralCursor + 10, staged.length, true)
  view.setUint32(centralCursor + 12, centralSize, true)
  view.setUint32(centralCursor + 16, offset, true)
  view.setUint16(centralCursor + 20, 0, true)

  return output
}

export const entryToText = (entry: ArchiveEntry): string => textDecoder.decode(entry.bytes)

export const textToBytes = (text: string): Uint8Array => textEncoder.encode(text)

/**
 * Builds the directory tree the left pane renders. Intermediate directories are synthesized from
 * the path segments, and every level is sorted directories-first then alphabetically.
 */
export const buildArchiveTree = (entries: readonly ArchiveEntry[]): ArchiveTreeNode[] => {
  const root: ArchiveTreeNode[] = []

  const findOrCreateDirectory = (
    siblings: ArchiveTreeNode[],
    name: string,
    path: string,
  ): ArchiveTreeNode => {
    const existing = siblings.find((node) => node.isDirectory && node.name === name)
    if (existing) {
      return existing
    }
    const created: ArchiveTreeNode = { name, path, isDirectory: true, children: [] }
    siblings.push(created)
    return created
  }

  for (const entry of entries) {
    const segments = entry.path.split('/').filter(Boolean)
    if (segments.length === 0) continue

    let siblings = root
    segments.forEach((segment, index) => {
      const isLeaf = index === segments.length - 1
      const path = segments.slice(0, index + 1).join('/')
      if (isLeaf) {
        siblings.push({ name: segment, path: entry.path, isDirectory: false, children: [] })
      } else {
        siblings = findOrCreateDirectory(siblings, segment, path).children
      }
    })
  }

  const sortLevel = (nodes: ArchiveTreeNode[]): ArchiveTreeNode[] => {
    nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    nodes.forEach((node) => sortLevel(node.children))
    return nodes
  }

  return sortLevel(root)
}

/** Normalizes a user-typed path (e.g. `/policies//new.cedar`) into an archive path. */
export const normalizeArchivePath = (input: string): string =>
  input
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/')

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`
}
