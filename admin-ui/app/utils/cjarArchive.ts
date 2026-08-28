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

const UTF8_NAME_FLAG = 0x0800

const MAX_ENTRY_BYTES = 16 * 1024 * 1024
const MAX_ARCHIVE_BYTES = 64 * 1024 * 1024

const LOCAL_HEADER_SIZE = 30
const CENTRAL_HEADER_SIZE = 46
const EOCD_SIZE = 22
const DEFLATE_RAW = 'deflate-raw'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const TEXT_EXTENSIONS = new Set([
  'cedar',
  'cedarschema',
  'cedarentities',
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

export const isDirectoryPath = (path: string): boolean => path.endsWith('/')

export const isTextEntry = (path: string): boolean => {
  if (isDirectoryPath(path)) return false
  const name = path.split('/').pop() ?? ''
  if (TEXT_FILENAMES.has(name.toUpperCase())) {
    return true
  }
  const extension = name.includes('.') ? name.split('.').pop()?.toLowerCase() : undefined
  return extension ? TEXT_EXTENSIONS.has(extension) : false
}

export const editorModeFor = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase()
  if (extension === 'json') return 'json'
  if (extension === 'xml') return 'xml'
  if (extension === 'yaml' || extension === 'yml') return 'yaml'
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

const canDecompress = (): boolean => typeof DecompressionStream === 'function'
const canCompress = (): boolean => typeof CompressionStream === 'function'

const runThroughStream = async (
  data: Uint8Array,
  transform: CompressionStream | DecompressionStream,
  maxBytes = Number.POSITIVE_INFINITY,
): Promise<Uint8Array> => {
  const copy = new Uint8Array(new ArrayBuffer(data.length))
  copy.set(data)
  const stream = new Blob([copy]).stream().pipeThrough(transform)
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.length
      if (total > maxBytes) {
        await reader.cancel()
        throw new Error('Policy store archive expands beyond the supported size.')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const output = new Uint8Array(new ArrayBuffer(total))
  let offset = 0
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }
  return output
}

const inflateRaw = async (data: Uint8Array, maxBytes: number): Promise<Uint8Array> => {
  if (!canDecompress()) {
    throw new Error('This browser cannot decompress the policy store archive.')
  }
  return runThroughStream(data, new DecompressionStream(DEFLATE_RAW), maxBytes)
}

const deflateRaw = async (data: Uint8Array): Promise<Uint8Array> =>
  runThroughStream(data, new CompressionStream(DEFLATE_RAW))

const findEndOfCentralDirectory = (view: DataView): number => {
  const earliest = Math.max(0, view.byteLength - EOCD_SIZE - 0xffff)
  for (let offset = view.byteLength - EOCD_SIZE; offset >= earliest; offset--) {
    if (view.getUint32(offset, true) === SIGNATURE.END_OF_CENTRAL_DIRECTORY) {
      return offset
    }
  }
  return -1
}

export const readArchive = async (bytes: Uint8Array): Promise<ArchiveEntry[]> => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const eocdOffset = findEndOfCentralDirectory(view)
  if (eocdOffset < 0) {
    throw new Error('Not a valid archive: end of central directory not found.')
  }

  const entryCount = view.getUint16(eocdOffset + 10, true)
  let cursor = view.getUint32(eocdOffset + 16, true)
  const entries: ArchiveEntry[] = []
  const seenPaths = new Set<string>()
  let totalBytes = 0

  for (let index = 0; index < entryCount; index++) {
    if (cursor < 0 || cursor + CENTRAL_HEADER_SIZE > bytes.length) {
      throw new Error('Not a valid archive: central directory runs past the end of the file.')
    }
    if (view.getUint32(cursor, true) !== SIGNATURE.CENTRAL_HEADER) {
      throw new Error('Not a valid archive: malformed central directory.')
    }
    const method = view.getUint16(cursor + 10, true)
    const expectedCrc = view.getUint32(cursor + 16, true)
    const compressedSize = view.getUint32(cursor + 20, true)
    const nameLength = view.getUint16(cursor + 28, true)
    const extraLength = view.getUint16(cursor + 30, true)
    const commentLength = view.getUint16(cursor + 32, true)
    const localOffset = view.getUint32(cursor + 42, true)
    const path = textDecoder.decode(
      bytes.subarray(cursor + CENTRAL_HEADER_SIZE, cursor + CENTRAL_HEADER_SIZE + nameLength),
    )

    if (isDirectoryPath(path)) {
      if (!seenPaths.has(path)) {
        seenPaths.add(path)
        entries.push({ path, bytes: new Uint8Array(0) })
      }
    } else {
      if (method !== COMPRESSION.STORED && method !== COMPRESSION.DEFLATE) {
        throw new Error(`Unsupported compression method ${method} for "${path}".`)
      }
      if (localOffset < 0 || localOffset + LOCAL_HEADER_SIZE > bytes.length) {
        throw new Error(`Not a valid archive: local header for "${path}" is out of bounds.`)
      }
      if (view.getUint32(localOffset, true) !== SIGNATURE.LOCAL_HEADER) {
        throw new Error(`Not a valid archive: bad local header for "${path}".`)
      }
      const localNameLength = view.getUint16(localOffset + 26, true)
      const localExtraLength = view.getUint16(localOffset + 28, true)
      const dataStart = localOffset + LOCAL_HEADER_SIZE + localNameLength + localExtraLength
      if (dataStart + compressedSize > bytes.length) {
        throw new Error(`Not a valid archive: "${path}" is truncated.`)
      }
      const budget = Math.min(MAX_ENTRY_BYTES, MAX_ARCHIVE_BYTES - totalBytes)
      if (method === COMPRESSION.STORED && compressedSize > budget) {
        throw new Error(`Policy store archive entry "${path}" exceeds the supported size.`)
      }
      const raw = bytes.subarray(dataStart, dataStart + compressedSize)
      const data = method === COMPRESSION.DEFLATE ? await inflateRaw(raw, budget) : raw.slice()
      if (crc32(data) !== expectedCrc) {
        throw new Error(`Not a valid archive: "${path}" failed its checksum.`)
      }
      if (seenPaths.has(path)) {
        throw new Error(`Not a valid archive: duplicate entry "${path}".`)
      }
      seenPaths.add(path)
      totalBytes += data.length
      entries.push({ path, bytes: data })
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

export const writeArchive = async (
  entries: readonly ArchiveEntry[],
): Promise<Uint8Array<ArrayBuffer>> => {
  const canDeflate = canCompress()
  const staged: StagedEntry[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = textEncoder.encode(entry.path)
    const deflated = canDeflate && entry.bytes.length > 0 ? await deflateRaw(entry.bytes) : null
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
    view.setUint16(at + 6, UTF8_NAME_FLAG, true)
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
    view.setUint16(centralCursor + 8, UTF8_NAME_FLAG, true)
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
    const isDirectory = isDirectoryPath(entry.path)
    const segments = entry.path.split('/').filter(Boolean)
    if (segments.length === 0) continue

    let siblings = root
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1
      const path = segments.slice(0, index + 1).join('/')
      if (isLast && !isDirectory) {
        siblings.push({ name: segment, path: entry.path, isDirectory: false, children: [] })
      } else {
        siblings = findOrCreateDirectory(siblings, segment, `${path}/`).children
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

export const flattenArchiveTree = (nodes: readonly ArchiveTreeNode[]): string[] =>
  nodes.flatMap((node) => (node.isDirectory ? flattenArchiveTree(node.children) : [node.path]))

export const normalizeArchivePath = (input: string): string =>
  input
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/')

export const normalizeArchiveDirectoryPath = (input: string): string => {
  const normalized = normalizeArchivePath(input)
  return normalized ? `${normalized}/` : ''
}

export const countTreeFiles = (nodes: readonly ArchiveTreeNode[]): number =>
  nodes.reduce((total, node) => total + (node.isDirectory ? countTreeFiles(node.children) : 1), 0)

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`
}
