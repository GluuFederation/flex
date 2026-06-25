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
