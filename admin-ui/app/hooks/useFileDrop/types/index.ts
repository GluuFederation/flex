import type {
  DragEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from 'react'

export type Accept = Record<string, readonly string[]>
export type FileError = { code: string; message: string }
export type FileRejection = { file: File; errors: FileError[] }

export type UseFileDropOptions = {
  onDrop: (acceptedFiles: File[]) => void
  accept?: Accept
  maxSize?: number
  disabled?: boolean
  onDropRejected?: (fileRejections: FileRejection[]) => void
}

export type RootProps = HTMLAttributes<HTMLElement> & {
  onClick: (event: MouseEvent<HTMLElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
  onDrop: (event: DragEvent<HTMLElement>) => void
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDragEnter: (event: DragEvent<HTMLElement>) => void
  onDragLeave: (event: DragEvent<HTMLElement>) => void
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref: Ref<HTMLInputElement>
}

export type UseFileDropResult = {
  getRootProps: (props?: HTMLAttributes<HTMLElement>) => RootProps
  getInputProps: (props?: InputHTMLAttributes<HTMLInputElement>) => InputProps
  isDragActive: boolean
  open: () => void
}
