import React from 'react'
import { render, screen } from '@testing-library/react'
import { createAgamaTestStore, createAgamaTestWrapper } from '../helpers/agamaTestUtils'
import AgamaProjectConfigModal from '../../AgamaProjectConfigModal'
import type { AgamaProject } from '../../types'

const mockRow: AgamaProject = {
  dn: 'test-project-dn',
  id: 'test-project-id',
  createdAt: '2024-01-15T10:30:00.000Z',
  finishedAt: '2024-01-15T10:31:00.000Z',
  details: {
    projectMetadata: {
      projectName: 'my-test-project',
      author: 'Test Author',
      version: '1.0.0',
      description: 'Test description',
      type: 'community',
    },
    flowsError: {},
  },
  deployed_on: '01/15/24, 10:30 AM',
  type: 'community',
  status: 'Processed',
  error: 'No',
}

const defaultProps = {
  isOpen: true,
  row: mockRow,
  handler: jest.fn(),
  handleUpdateRowData: jest.fn(),
  manageConfig: false,
}

describe('AgamaProjectConfigModal', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    const store = createAgamaTestStore()
    Wrapper = createAgamaTestWrapper(store)
  })

  it('does not render when isOpen is false', () => {
    render(<AgamaProjectConfigModal {...defaultProps} isOpen={false} />, { wrapper: Wrapper })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the modal when isOpen is true', () => {
    render(<AgamaProjectConfigModal {...defaultProps} />, { wrapper: Wrapper })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows project details title when manageConfig is false', () => {
    render(<AgamaProjectConfigModal {...defaultProps} manageConfig={false} />, { wrapper: Wrapper })
    expect(screen.getByText(/Details of project my-test-project/i)).toBeInTheDocument()
  })

  it('shows manage configuration title when manageConfig is true', () => {
    render(<AgamaProjectConfigModal {...defaultProps} manageConfig={true} />, { wrapper: Wrapper })
    expect(
      screen.getByText(/Manage Configuration for Project my-test-project/i),
    ).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<AgamaProjectConfigModal {...defaultProps} />, { wrapper: Wrapper })
    expect(screen.getByTitle(/close/i)).toBeInTheDocument()
  })
})
