import { fireEvent, render } from '@testing-library/react'
import { useFileDrop } from '../useFileDrop'
import type { Accept, FileRejection } from '../useFileDrop'

type HarnessProps = {
  onDrop: (files: File[]) => void
  accept?: Accept
  maxSize?: number
  onDropRejected?: (rejections: FileRejection[]) => void
}

const Harness = (props: HarnessProps) => {
  const { getInputProps } = useFileDrop(props)
  return <input data-testid="file-input" {...getInputProps()} />
}

const changeFiles = (input: HTMLElement, files: File[]) => {
  fireEvent.change(input, { target: { files } })
}

describe('useFileDrop', () => {
  it('passes a single accepted file to onDrop', () => {
    const onDrop = jest.fn()
    const { getByTestId } = render(
      <Harness onDrop={onDrop} accept={{ 'application/jwt': ['.jwt'] }} />,
    )
    const file = new File(['payload'], 'token.jwt', { type: 'application/jwt' })

    changeFiles(getByTestId('file-input'), [file])

    expect(onDrop).toHaveBeenCalledWith([file])
  })

  it('accepts files by extension when the browser reports an empty mime type', () => {
    const onDrop = jest.fn()
    const { getByTestId } = render(
      <Harness onDrop={onDrop} accept={{ 'application/octet-stream': ['.gama'] }} />,
    )
    const file = new File(['x'], 'project.gama', { type: '' })

    changeFiles(getByTestId('file-input'), [file])

    expect(onDrop).toHaveBeenCalledWith([file])
  })

  it('rejects files larger than maxSize with a file-too-large error', () => {
    const onDrop = jest.fn()
    const onDropRejected = jest.fn()
    const { getByTestId } = render(
      <Harness onDrop={onDrop} maxSize={10} onDropRejected={onDropRejected} />,
    )
    const file = new File([new Uint8Array(100)], 'big.zip', { type: 'application/zip' })

    changeFiles(getByTestId('file-input'), [file])

    expect(onDrop).toHaveBeenCalledWith([])
    expect(onDropRejected).toHaveBeenCalledTimes(1)
    const [[rejections]] = onDropRejected.mock.calls
    expect(rejections[0].file).toBe(file)
    expect(rejections[0].errors[0].code).toBe('file-too-large')
  })

  it('configures the input as a single-file picker', () => {
    const { getByTestId } = render(
      <Harness onDrop={jest.fn()} accept={{ 'text/plain': ['.txt'] }} />,
    )
    const input = getByTestId('file-input') as HTMLInputElement

    expect(input.multiple).toBe(false)
    expect(input.type).toBe('file')
    expect(input.accept).toContain('.txt')
  })

  it('stops the hidden input click from bubbling to the root', () => {
    const rootClick = jest.fn()
    const RootHarness = () => {
      const { getRootProps, getInputProps } = useFileDrop({ onDrop: jest.fn() })
      return (
        <div data-testid="root" {...getRootProps({ onClick: rootClick })}>
          <input data-testid="root-input" {...getInputProps()} />
        </div>
      )
    }
    const { getByTestId } = render(<RootHarness />)

    fireEvent.click(getByTestId('root-input'))

    expect(rootClick).not.toHaveBeenCalled()
  })

  it('keeps isDragActive true until the matching number of drag-leaves', () => {
    const DragHarness = () => {
      const { getRootProps, isDragActive } = useFileDrop({ onDrop: jest.fn() })
      return (
        <div data-testid="root" {...getRootProps()}>
          <span data-testid="active">{String(isDragActive)}</span>
          <span data-testid="child">child</span>
        </div>
      )
    }
    const { getByTestId } = render(<DragHarness />)
    const root = getByTestId('root')
    const child = getByTestId('child')

    fireEvent.dragEnter(root)
    fireEvent.dragEnter(child)
    expect(getByTestId('active').textContent).toBe('true')

    fireEvent.dragLeave(child)
    expect(getByTestId('active').textContent).toBe('true')

    fireEvent.dragLeave(root)
    expect(getByTestId('active').textContent).toBe('false')
  })
})
