type ZipEntry = { name: string; dir: boolean; text: () => Promise<string> }
type ZipArchive = { files: Record<string, ZipEntry> }

const EOCD_SIGNATURE = 0x06054b50
const EOCD_MIN_SIZE = 22
const MAX_COMMENT_SIZE = 0xffff
const CENTRAL_HEADER_FIXED_SIZE = 46
const LOCAL_HEADER_FIXED_SIZE = 30
const COMPRESSION_STORED = 0
const COMPRESSION_DEFLATE = 8
const MAX_UNCOMPRESSED_SIZE = 100 * 1024 * 1024

const toBytes = async (input: Blob | ArrayBuffer | Uint8Array): Promise<Uint8Array> => {
  if (input instanceof Uint8Array) {
    return input
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input)
  }
  return new Uint8Array(await input.arrayBuffer())
}

const findEndOfCentralDirectory = (
  view: DataView,
  length: number,
): { entryCount: number; centralDirectoryOffset: number } => {
  const minPosition = Math.max(0, length - EOCD_MIN_SIZE - MAX_COMMENT_SIZE)
  for (let position = length - EOCD_MIN_SIZE; position >= minPosition; position -= 1) {
    if (view.getUint32(position, true) === EOCD_SIGNATURE) {
      return {
        entryCount: view.getUint16(position + 10, true),
        centralDirectoryOffset: view.getUint32(position + 16, true),
      }
    }
  }
  throw new Error('readZip: input is not a valid zip (no end-of-central-directory record)')
}

const inflateRaw = async (data: Uint8Array): Promise<Uint8Array> => {
  const stream = new Blob([new Uint8Array(data)])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

const readZip = async (input: Blob | ArrayBuffer | Uint8Array): Promise<ZipArchive> => {
  const bytes = await toBytes(input)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const decoder = new TextDecoder()
  const { entryCount, centralDirectoryOffset } = findEndOfCentralDirectory(view, bytes.byteLength)

  const files: Record<string, ZipEntry> = {}
  let cursor = centralDirectoryOffset
  for (let index = 0; index < entryCount; index += 1) {
    const method = view.getUint16(cursor + 10, true)
    const compressedSize = view.getUint32(cursor + 20, true)
    const uncompressedSize = view.getUint32(cursor + 24, true)
    const fileNameLength = view.getUint16(cursor + 28, true)
    const extraFieldLength = view.getUint16(cursor + 30, true)
    const fileCommentLength = view.getUint16(cursor + 32, true)
    const localHeaderOffset = view.getUint32(cursor + 42, true)
    const nameStart = cursor + CENTRAL_HEADER_FIXED_SIZE
    const name = decoder.decode(bytes.subarray(nameStart, nameStart + fileNameLength))
    const dir = name.endsWith('/')

    const text = async (): Promise<string> => {
      if (dir || compressedSize === 0) {
        return ''
      }
      if (uncompressedSize > MAX_UNCOMPRESSED_SIZE) {
        throw new Error(`readZip: entry "${name}" exceeds the maximum uncompressed size`)
      }
      const localNameLength = view.getUint16(localHeaderOffset + 26, true)
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true)
      const dataStart =
        localHeaderOffset + LOCAL_HEADER_FIXED_SIZE + localNameLength + localExtraLength
      const data = bytes.subarray(dataStart, dataStart + compressedSize)
      if (method === COMPRESSION_STORED) {
        return decoder.decode(data)
      }
      if (method === COMPRESSION_DEFLATE) {
        return decoder.decode(await inflateRaw(data))
      }
      throw new Error(`readZip: unsupported compression method ${method} for "${name}"`)
    }

    files[name] = { name, dir, text }
    cursor = nameStart + fileNameLength + extraFieldLength + fileCommentLength
  }

  return { files }
}

export { readZip }
export type { ZipArchive }
