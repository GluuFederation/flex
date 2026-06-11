import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  ChangeEvent,
  DragEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from 'react'
import type {
  Accept,
  FileError,
  FileRejection,
  InputProps,
  RootProps,
  UseFileDropOptions,
  UseFileDropResult,
} from './types'

const ERROR_FILE_INVALID_TYPE = 'file-invalid-type'
const ERROR_FILE_TOO_LARGE = 'file-too-large'

const matchesMimePattern = (fileType: string, pattern: string): boolean => {
  if (pattern === fileType) {
    return true
  }
  if (pattern.endsWith('/*')) {
    return fileType.startsWith(pattern.slice(0, -1))
  }
  return false
}

const isAccepted = (file: File, accept?: Accept): boolean => {
  if (!accept || Object.keys(accept).length === 0) {
    return true
  }
  const fileName = file.name.toLowerCase()
  return Object.entries(accept).some(([mimePattern, extensions]) => {
    if (file.type && matchesMimePattern(file.type, mimePattern)) {
      return true
    }
    return extensions.some((extension) => fileName.endsWith(extension.toLowerCase()))
  })
}

const buildAcceptAttribute = (accept?: Accept): string | undefined => {
  if (!accept) {
    return undefined
  }
  const tokens = Object.entries(accept).flatMap(([mimePattern, extensions]) => [
    mimePattern,
    ...extensions,
  ])
  return tokens.length > 0 ? tokens.join(',') : undefined
}

const validateFile = (file: File, accept?: Accept, maxSize?: number): FileError[] => {
  const errors: FileError[] = []
  if (!isAccepted(file, accept)) {
    errors.push({ code: ERROR_FILE_INVALID_TYPE, message: 'File type is not accepted' })
  }
  if (maxSize != null && file.size > maxSize) {
    errors.push({ code: ERROR_FILE_TOO_LARGE, message: `File is larger than ${maxSize} bytes` })
  }
  return errors
}

export const useFileDrop = ({
  onDrop,
  accept,
  maxSize,
  disabled = false,
  onDropRejected,
}: UseFileDropOptions): UseFileDropResult => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragTargetsRef = useRef<Node[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault()
    document.addEventListener('dragover', preventDefault, false)
    document.addEventListener('drop', preventDefault, false)
    return () => {
      document.removeEventListener('dragover', preventDefault)
      document.removeEventListener('drop', preventDefault)
    }
  }, [])

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      const files = fileList ? Array.from(fileList) : []
      const accepted: File[] = []
      const rejected: FileRejection[] = []
      for (const file of files) {
        const errors = validateFile(file, accept, maxSize)
        if (errors.length === 0) {
          accepted.push(file)
        } else {
          rejected.push({ file, errors })
        }
      }
      if (rejected.length > 0) {
        onDropRejected?.(rejected)
      }
      onDrop(accepted)
    },
    [accept, maxSize, onDrop, onDropRejected],
  )

  const open = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const getRootProps = useCallback(
    (props: HTMLAttributes<HTMLElement> = {}): RootProps => ({
      ...props,
      role: 'presentation',
      tabIndex: disabled ? -1 : 0,
      onClick: (event: MouseEvent<HTMLElement>) => {
        props.onClick?.(event)
        open()
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        props.onKeyDown?.(event)
        if (event.target !== event.currentTarget) {
          return
        }
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          open()
        }
      },
      onDrop: (event: DragEvent<HTMLElement>) => {
        event.preventDefault()
        dragTargetsRef.current = []
        setIsDragActive(false)
        if (!disabled) {
          processFiles(event.dataTransfer.files)
        }
      },
      onDragOver: (event: DragEvent<HTMLElement>) => {
        event.preventDefault()
      },
      onDragEnter: (event: DragEvent<HTMLElement>) => {
        event.preventDefault()
        if (event.target instanceof Node) {
          dragTargetsRef.current = [...dragTargetsRef.current, event.target]
        }
        if (!disabled) {
          setIsDragActive(true)
        }
      },
      onDragLeave: (event: DragEvent<HTMLElement>) => {
        event.preventDefault()
        const root = event.currentTarget
        const remaining = dragTargetsRef.current.filter(
          (target) => target !== event.target && root.contains(target),
        )
        dragTargetsRef.current = remaining
        if (remaining.length === 0) {
          setIsDragActive(false)
        }
      },
    }),
    [open, disabled, processFiles],
  )

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}): InputProps => ({
      ...props,
      ref: inputRef,
      type: 'file',
      multiple: false,
      accept: buildAcceptAttribute(accept),
      disabled,
      style: { display: 'none', ...props.style },
      onClick: (event: MouseEvent<HTMLInputElement>) => {
        props.onClick?.(event)
        event.stopPropagation()
      },
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(event)
        processFiles(event.target.files)
        event.target.value = ''
      },
    }),
    [accept, disabled, processFiles],
  )

  return { getRootProps, getInputProps, isDragActive, open }
}

export default useFileDrop
