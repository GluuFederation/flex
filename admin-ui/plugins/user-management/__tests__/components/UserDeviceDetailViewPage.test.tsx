import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementQueryClient,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserDeviceDetailViewPage from 'Plugins/user-management/components/UserDeviceDetailViewPage'
import type { UserDeviceDetailViewPageProps } from 'Plugins/user-management/types'

const store = createUserManagementTestStore()
const queryClient = createUserManagementQueryClient()
const Wrapper = createUserManagementTestWrapper(store, queryClient)

const rowWithDevice: UserDeviceDetailViewPageProps['row'] = {
  rowData: {
    registrationData: {
      domain: 'example.com',
      type: 'platform',
      status: 'registered',
      createdBy: 'admin',
    },
    deviceData: {
      name: 'My Phone',
      os_name: 'iOS',
      os_version: '17.1',
      platform: 'mobile',
    },
  },
}

describe('UserDeviceDetailViewPage', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('renders without crashing', () => {
    render(<UserDeviceDetailViewPage row={rowWithDevice} />, { wrapper: Wrapper })
    expect(screen.getByText('Domain:')).toBeInTheDocument()
  })

  it('renders registration field labels', () => {
    render(<UserDeviceDetailViewPage row={rowWithDevice} />, { wrapper: Wrapper })
    expect(screen.getByText('Domain:')).toBeInTheDocument()
    expect(screen.getByText('Type:')).toBeInTheDocument()
    expect(screen.getByText('Status:')).toBeInTheDocument()
    expect(screen.getByText('Created By:')).toBeInTheDocument()
  })

  it('populates registration values', () => {
    render(<UserDeviceDetailViewPage row={rowWithDevice} />, { wrapper: Wrapper })
    expect(screen.getByText('example.com')).toBeInTheDocument()
    expect(screen.getByText('platform')).toBeInTheDocument()
    expect(screen.getByText('registered')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders the device information section when deviceData is present', () => {
    render(<UserDeviceDetailViewPage row={rowWithDevice} />, { wrapper: Wrapper })
    expect(screen.getByText('Device Information')).toBeInTheDocument()
    expect(screen.getByText('My Phone')).toBeInTheDocument()
    expect(screen.getByText('iOS')).toBeInTheDocument()
    expect(screen.getByText('17.1')).toBeInTheDocument()
    expect(screen.getByText('mobile')).toBeInTheDocument()
  })

  it('falls back to rpId when domain is absent', () => {
    const row: UserDeviceDetailViewPageProps['row'] = {
      rowData: {
        registrationData: { rpId: 'rp.example.org', type: 'cross-platform' },
      },
    }
    render(<UserDeviceDetailViewPage row={row} />, { wrapper: Wrapper })
    expect(screen.getByText('rp.example.org')).toBeInTheDocument()
  })

  it('hides the device information section when deviceData is absent', () => {
    const row: UserDeviceDetailViewPageProps['row'] = {
      rowData: {
        registrationData: { domain: 'example.com' },
      },
    }
    render(<UserDeviceDetailViewPage row={row} />, { wrapper: Wrapper })
    expect(screen.queryByText('Device Information')).not.toBeInTheDocument()
  })
})
