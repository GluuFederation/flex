import React from 'react'
import { render, within } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
  mockAgamaProjects,
} from './helpers/authenticationTestUtils'
import { mockAgamaDeployments, mockLdapConfigurations } from './fixtures/mockAuthenticationData'
import DefaultAcr from '../DefaultAcr/DefaultAcr'
import Acrs from '../Acrs/Acrs'

const ldapConfigIds = new Set(mockLdapConfigurations.map((config) => config.configId))

const renderInWrapper = (ui: React.ReactElement) =>
  render(ui, { wrapper: createAuthenticationTestWrapper(createAuthenticationTestStore()) })

const defaultAcrOptions = (): string[] => {
  const { container, unmount } = renderInWrapper(<DefaultAcr />)
  const values = Array.from(
    container.querySelectorAll<HTMLOptionElement>('select[name="defaultAcr"] option'),
  )
    .map((option) => option.value)
    .filter(Boolean)
  unmount()
  return values
}

const acrTableNames = (): string[] => {
  const { container, unmount } = renderInWrapper(<Acrs />)
  const table = container.querySelector('table') as HTMLTableElement
  const names = within(table)
    .getAllByRole('row')
    .map((row) => row.querySelectorAll('td'))
    .filter((cells) => cells.length > 1)
    .map((cells) => cells[1].textContent ?? '')
  unmount()
  return names
}

describe('Default ACR dropdown and ACRs table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAgamaProjects(mockAgamaDeployments)
  })

  it('list the same ACRs, apart from LDAP backends that only the table shows', () => {
    const options = defaultAcrOptions()
    const tableAcrs = acrTableNames().filter((name) => !ldapConfigIds.has(name))

    expect(options.length).toBeGreaterThan(0)
    expect([...tableAcrs].sort()).toEqual([...options].sort())
  })
})
