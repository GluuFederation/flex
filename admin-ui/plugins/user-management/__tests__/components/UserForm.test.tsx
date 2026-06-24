import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementQueryClient,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserForm from 'Plugins/user-management/components/UserForm'
import type { CustomUser, CustomAttribute, PersonAttribute } from 'Plugins/user-management/types'

const store = createUserManagementTestStore()
const queryClient = createUserManagementQueryClient()
const Wrapper = createUserManagementTestWrapper(store, queryClient)

const personAttributes: PersonAttribute[] = []

// The form maps string-valued custom attributes (e.g. `sn`) into form fields via
// initializeCustomAttributes, which reads `values[0]` as a string at runtime. The generated
// CustomUser type models customAttributes with object-only values, so the string `sn` value is
// supplied through the project's looser CustomAttribute type and the user is assembled from it.
const snAttribute: CustomAttribute = { name: 'sn', values: ['Doe'] }

const mockUser: CustomUser = {
  inum: 'test-inum-123',
  userId: 'jdoe',
  displayName: 'John Doe',
  givenName: 'John',
  mail: 'jdoe@example.com',
  status: 'active',
  customAttributes: [snAttribute] as CustomUser['customAttributes'],
}

const onSubmitData = jest.fn()

const renderForm = async (ui: React.ReactElement) => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(ui, { wrapper: Wrapper })
  })
  await screen.findByTestId('userId')
  return result!
}

describe('UserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  describe('edit mode (with userDetails)', () => {
    it('renders without crashing and shows core fields', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.getByText(/First Name/i)).toBeInTheDocument()
      expect(screen.getByText(/Email/i)).toBeInTheDocument()
    })

    it('populates first name from userDetails', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.getByTestId('givenName')).toHaveValue('John')
    })

    it('populates user name, display name, email and last name', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.getByTestId('userId')).toHaveValue('jdoe')
      expect(screen.getByTestId('displayName')).toHaveValue('John Doe')
      expect(screen.getByTestId('mail')).toHaveValue('jdoe@example.com')
      expect(screen.getByTestId('sn')).toHaveValue('Doe')
    })

    it('renders the inum field as disabled', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      const inum = screen.getByTestId('inum')
      expect(inum).toHaveValue('test-inum-123')
      expect(inum).toBeDisabled()
    })

    it('renders the change password button in edit mode', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.getByText(/Change Password/i)).toBeInTheDocument()
    })

    it('does not render password fields in edit mode', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.queryByTestId('userPassword')).not.toBeInTheDocument()
      expect(screen.queryByTestId('userConfirmPassword')).not.toBeInTheDocument()
    })

    it('renders footer Back, Cancel and Apply buttons', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })

    it('disables Apply and Cancel when the form is pristine', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      expect(screen.getByText(/Apply/i).closest('button')).toBeDisabled()
      expect(screen.getByText(/Cancel/i).closest('button')).toBeDisabled()
    })
  })

  describe('add mode (no userDetails)', () => {
    it('renders empty core fields', async () => {
      await renderForm(<UserForm personAttributes={personAttributes} onSubmitData={onSubmitData} />)
      expect(screen.getByTestId('givenName')).toHaveValue('')
      expect(screen.getByTestId('userId')).toHaveValue('')
      expect(screen.getByTestId('mail')).toHaveValue('')
    })

    it('renders password and confirm password fields', async () => {
      await renderForm(<UserForm personAttributes={personAttributes} onSubmitData={onSubmitData} />)
      expect(screen.getByTestId('userPassword')).toBeInTheDocument()
      expect(screen.getByTestId('userConfirmPassword')).toBeInTheDocument()
    })

    it('does not render the inum field', async () => {
      await renderForm(<UserForm personAttributes={personAttributes} onSubmitData={onSubmitData} />)
      expect(screen.queryByTestId('inum')).not.toBeInTheDocument()
    })

    it('does not render the change password button', async () => {
      await renderForm(<UserForm personAttributes={personAttributes} onSubmitData={onSubmitData} />)
      expect(screen.queryByText(/Change Password/i)).not.toBeInTheDocument()
    })
  })

  describe('isSubmitting behavior', () => {
    it('disables the Apply button while submitting', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
          isSubmitting
        />,
      )
      expect(screen.getByText(/Apply/i).closest('button')).toBeDisabled()
    })
  })

  describe('form interactions', () => {
    it('allows typing in the first name field', async () => {
      await renderForm(<UserForm personAttributes={personAttributes} onSubmitData={onSubmitData} />)
      const input = screen.getByTestId('givenName')
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Jane' } })
      })
      expect(input).toHaveValue('Jane')
    })

    it('enables Apply once a field is changed in edit mode', async () => {
      await renderForm(
        <UserForm
          userDetails={mockUser}
          personAttributes={personAttributes}
          onSubmitData={onSubmitData}
        />,
      )
      await act(async () => {
        fireEvent.change(screen.getByTestId('displayName'), {
          target: { value: 'John Updated' },
        })
      })
      await waitFor(() => {
        expect(screen.getByText(/Apply/i).closest('button')).not.toBeDisabled()
      })
    })
  })
})
