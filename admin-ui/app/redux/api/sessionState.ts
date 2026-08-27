let readHasSession: (() => boolean) | null = null

const setHasSessionReader = (reader: () => boolean): void => {
  readHasSession = reader
}

const hasActiveSession = (): boolean => {
  try {
    return readHasSession?.() ?? false
  } catch {
    return false
  }
}

export { setHasSessionReader, hasActiveSession }
