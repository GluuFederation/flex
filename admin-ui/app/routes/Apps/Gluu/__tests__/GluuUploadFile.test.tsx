import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuUploadFile from 'Routes/Apps/Gluu/GluuUploadFile'
import type { GluuUploadFileProps } from 'Routes/Apps/Gluu/types'

const baseProps = (overrides: Partial<GluuUploadFileProps> = {}): GluuUploadFileProps => ({
  onDrop: jest.fn(),
  onClearFiles: jest.fn(),
  placeholder: 'Drop your file here',
  ...overrides,
})

const renderUploadFile = (props: GluuUploadFileProps) =>
  render(
    <AppTestWrapper>
      <GluuUploadFile {...props} />
    </AppTestWrapper>,
  )

describe('GluuUploadFile', () => {
  it('renders the placeholder text when no file is selected', () => {
    renderUploadFile(baseProps())
    expect(screen.getByText('Drop your file here')).toBeInTheDocument()
  })

  it('renders a hidden file input', () => {
    const { container } = renderUploadFile(baseProps())
    expect(container.querySelector('input[type="file"]')).toBeInTheDocument()
  })

  it('exposes only the accepted extension on the file input', () => {
    const { container } = renderUploadFile(
      baseProps({ accept: { 'application/vnd.gluu.cjar': ['.cjar'] } }),
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input.accept).toBe('application/vnd.gluu.cjar,.cjar')
    expect(input.accept).not.toContain('application/zip')
  })

  it('reports a rejected file instead of selecting it', () => {
    const onDrop = jest.fn()
    const onDropRejected = jest.fn()
    const { container } = renderUploadFile(
      baseProps({ onDrop, onDropRejected, accept: { 'application/vnd.gluu.cjar': ['.cjar'] } }),
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'files.zip', { type: 'application/zip' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(onDropRejected).toHaveBeenCalledTimes(1)
    expect(onDrop).not.toHaveBeenCalled()
    expect(screen.queryByText('files.zip')).not.toBeInTheDocument()
  })

  it('selects a file that matches the accepted extension', () => {
    const onDrop = jest.fn()
    const onDropRejected = jest.fn()
    const { container } = renderUploadFile(
      baseProps({ onDrop, onDropRejected, accept: { 'application/vnd.gluu.cjar': ['.cjar'] } }),
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'store.cjar', { type: '' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(onDropRejected).not.toHaveBeenCalled()
    expect(onDrop).toHaveBeenCalledWith([file])
    expect(screen.getByText('store.cjar')).toBeInTheDocument()
  })

  it('renders the file name and a remove button when fileName is provided', () => {
    renderUploadFile(baseProps({ fileName: 'cert.jwt' }))
    expect(screen.getByText('cert.jwt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('calls onClearFiles when the remove button is clicked', () => {
    const onClearFiles = jest.fn()
    renderUploadFile(baseProps({ fileName: 'cert.jwt', onClearFiles }))
    fireEvent.click(screen.getByRole('button', { name: /remove/i }))
    expect(onClearFiles).toHaveBeenCalledTimes(1)
  })

  it('hides the remove button when showClearButton is false', () => {
    renderUploadFile(baseProps({ fileName: 'cert.jwt', showClearButton: false }))
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('disables the remove button when disabled is true', () => {
    renderUploadFile(baseProps({ fileName: 'cert.jwt', disabled: true }))
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
  })
})
