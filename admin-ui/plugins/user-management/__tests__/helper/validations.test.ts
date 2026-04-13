import {
  getUserValidationSchema,
  getPasswordChangeValidationSchema,
  initializeCustomAttributes,
} from 'Plugins/user-management/helper/validations'

describe('getUserValidationSchema', () => {
  const schema = getUserValidationSchema(null)

  it('should pass with valid data', async () => {
    const validData = {
      displayName: 'John Doe',
      givenName: 'John',
      sn: 'Doe',
      userId: 'johndoe',
      mail: 'john@example.com',
      userPassword: 'Password1!',
      userConfirmPassword: 'Password1!',
    }

    await expect(schema.validate(validData)).resolves.toBeDefined()
  })

  it('should fail when password is empty', async () => {
    const invalidData = {
      displayName: 'John Doe',
      givenName: 'John',
      sn: 'Doe',
      userId: 'johndoe',
      mail: 'john@example.com',
      userPassword: '',
      userConfirmPassword: '',
    }

    await expect(schema.validate(invalidData)).rejects.toThrow()
  })
})

describe('getPasswordChangeValidationSchema', () => {
  const schema = getPasswordChangeValidationSchema()

  it('should pass with valid matching passwords', async () => {
    const validData = {
      userPassword: 'Password1!',
      userConfirmPassword: 'Password1!',
    }

    await expect(schema.validate(validData)).resolves.toBeDefined()
  })

  it('should fail when passwords do not match', async () => {
    const invalidData = {
      userPassword: 'Password1!',
      userConfirmPassword: 'DifferentPass1!',
    }

    await expect(schema.validate(invalidData)).rejects.toThrow()
  })

  it('should fail when password is empty', async () => {
    const invalidData = {
      userPassword: '',
      userConfirmPassword: '',
    }

    await expect(schema.validate(invalidData)).rejects.toThrow()
  })
})

describe('initializeCustomAttributes', () => {
  it('should return correct default form values for null user', () => {
    const result = initializeCustomAttributes(null, [])

    expect(result.displayName).toBe('')
    expect(result.givenName).toBe('')
    expect(result.mail).toBe('')
    expect(result.userId).toBe('')
    expect(result.sn).toBe('')
    expect(result.middleName).toBe('')
    expect(result.status).toBe('')
    expect(result.userPassword).toBe('')
    expect(result.userConfirmPassword).toBe('')
  })
})
