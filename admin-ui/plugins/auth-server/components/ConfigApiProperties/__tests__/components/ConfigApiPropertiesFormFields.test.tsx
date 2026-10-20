import { Profiler } from 'react'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ConfigApiPropertiesForm from '../../components/ConfigApiPropertiesForm'
import type { ApiAppConfiguration } from '../../types'

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}))

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({ canRead: true, canWrite: true, canDelete: false })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { ConfigApiConfiguration: 'ConfigApiConfiguration' },
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateToRoute: jest.fn(), navigateBack: jest.fn() }),
  ROUTES: { HOME_DASHBOARD: '/home' },
}))

const mockListFieldRender = jest.fn()
jest.mock('Routes/Apps/Gluu/GluuAutocomplete', () => {
  const actual = jest.requireActual('Routes/Apps/Gluu/GluuAutocomplete')
  return {
    __esModule: true,
    default: (props: { name: string }) => {
      mockListFieldRender(props.name)
      return actual.default(props)
    },
  }
})

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: ({ modal, onAccept }: { modal: boolean; onAccept: (message: string) => void }) =>
    modal ? (
      <button type="button" onClick={() => onAccept('test commit message')}>
        Accept
      </button>
    ) : null,
}))

const configuration = {
  serviceName: 'jans-config-api',
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  maxCount: 200,
  apiApprovedIssuer: ['https://one.example', 'https://two.example'],
  agamaConfiguration: { mandatoryAttributes: ['qname', 'source'] },
} as ApiAppConfiguration

const renderForm = () =>
  render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={jest.fn()} />, {
    wrapper: AppTestWrapper,
  })

const fieldOf = (element: HTMLElement): HTMLElement => {
  let current: HTMLElement | null = element
  while (current && !current.querySelector('[role="combobox"]')) current = current.parentElement
  return current as HTMLElement
}

const removePill = (title: string): HTMLElement => {
  const field = fieldOf(screen.getByTitle(title))
  fireEvent.click(within(within(field).getByTitle(title)).getByRole('button'))
  return field
}

describe.each([
  ['a top-level list', 'https://two.example'],
  ['a list inside an object', 'source'],
])('ConfigApiPropertiesForm %s', (_case, value) => {
  it('hides a removed pill and still offers it in the dropdown', () => {
    renderForm()

    const field = removePill(value)
    expect(within(field).queryByTitle(value)).not.toBeInTheDocument()

    fireEvent.mouseDown(within(field).getByRole('combobox'))
    fireEvent.click(within(within(field).getByRole('listbox')).getByText(value))

    expect(within(field).getByTitle(value)).toBeInTheDocument()
  })

  it('brings a removed pill back on Cancel', () => {
    renderForm()

    removePill(value)
    expect(screen.queryByTitle(value)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.getByTitle(value)).toBeInTheDocument()
  })
})

describe('ConfigApiPropertiesForm logging level', () => {
  it('shows the newly selected level and restores the loaded one on Cancel', () => {
    renderForm()

    fireEvent.change(screen.getByTestId('loggingLevel'), { target: { value: 'DEBUG' } })
    expect(screen.getByTestId('loggingLevel')).toHaveValue('DEBUG')

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.getByTestId('loggingLevel')).toHaveValue('INFO')
  })
})

describe('ConfigApiPropertiesForm max count', () => {
  it('shows the typed number and restores the loaded one on Cancel', () => {
    renderForm()
    const maxCount = () => screen.getByDisplayValue(/^\d+$/) as HTMLInputElement

    fireEvent.change(maxCount(), { target: { value: '350' } })
    expect(maxCount()).toHaveValue(350)

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(maxCount()).toHaveValue(200)
  })
})

describe('ConfigApiPropertiesForm typing in a text field', () => {
  it('does not re-render any list field after the first keystroke', () => {
    renderForm()
    fireEvent.change(screen.getByDisplayValue('text'), { target: { value: 'j' } })
    mockListFieldRender.mockClear()

    fireEvent.change(screen.getByDisplayValue('j'), { target: { value: 'json' } })

    expect(screen.getByDisplayValue('json')).toBeInTheDocument()
    expect(mockListFieldRender).not.toHaveBeenCalled()
  })
})

describe('ConfigApiPropertiesForm list of objects', () => {
  const assetConfiguration = {
    serviceName: 'jans-config-api',
    assetMgtConfiguration: {
      assetMgtEnabled: true,
      assetDirMapping: [
        { directory: 'dirA', type: ['tA'], description: 'A', jansServiceModule: ['mA'] },
        { directory: 'dirB', type: ['tB'], description: 'B', jansServiceModule: ['mB'] },
        { directory: 'dirC', type: ['tC'], description: 'C', jansServiceModule: ['mC'] },
      ],
    },
  } as ApiAppConfiguration

  const cardOf = (directory: string): HTMLElement => {
    let current: HTMLElement | null = screen.getByDisplayValue(directory)
    while (current && !current.querySelector('button.remove-btn')) current = current.parentElement
    return current as HTMLElement
  }

  const removeCard = async (directory: string) => {
    fireEvent.click(cardOf(directory).querySelector('button.remove-btn') as HTMLElement)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30))
    })
  }

  it('removes both items when the second one moved into the place of the first', async () => {
    render(<ConfigApiPropertiesForm configuration={assetConfiguration} onSubmit={jest.fn()} />, {
      wrapper: AppTestWrapper,
    })

    await removeCard('dirA')
    await removeCard('dirB')

    expect(screen.queryByDisplayValue('dirA')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('dirB')).not.toBeInTheDocument()
    expect(screen.queryByTitle('tB')).not.toBeInTheDocument()
    expect(within(cardOf('dirC')).getByTitle('tC')).toBeInTheDocument()
    expect(within(cardOf('dirC')).getByTitle('mC')).toBeInTheDocument()
  })

  it('sends both removals when Apply is confirmed', async () => {
    const onSubmit = jest.fn()
    render(<ConfigApiPropertiesForm configuration={assetConfiguration} onSubmit={onSubmit} />, {
      wrapper: AppTestWrapper,
    })

    await removeCard('dirA')
    await removeCard('dirB')
    fireEvent.click(screen.getByRole('button', { name: /apply/i }))
    fireEvent.click(await screen.findByRole('button', { name: 'Accept' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toEqual([
      { op: 'remove', path: '/assetMgtConfiguration/assetDirMapping/0' },
      { op: 'remove', path: '/assetMgtConfiguration/assetDirMapping/0' },
    ])
  })
})

describe('ConfigApiPropertiesForm saving', () => {
  it('sends nothing until Apply is confirmed', async () => {
    const onSubmit = jest.fn()
    render(<ConfigApiPropertiesForm configuration={configuration} onSubmit={onSubmit} />, {
      wrapper: AppTestWrapper,
    })

    fireEvent.change(screen.getByDisplayValue('text'), { target: { value: 'json' } })
    fireEvent.change(screen.getByTestId('loggingLevel'), { target: { value: 'DEBUG' } })
    fireEvent.change(screen.getByDisplayValue('200'), { target: { value: '350' } })
    removePill('https://two.example')
    removePill('source')
    expect(onSubmit).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /apply/i }))
    const accept = await screen.findByRole('button', { name: 'Accept' })
    expect(onSubmit).not.toHaveBeenCalled()

    fireEvent.click(accept)
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        { op: 'replace', path: '/loggingLayout', value: 'json' },
        { op: 'replace', path: '/loggingLevel', value: 'DEBUG' },
        { op: 'replace', path: '/maxCount', value: 350 },
        { op: 'replace', path: '/apiApprovedIssuer', value: ['https://one.example'] },
        { op: 'replace', path: '/agamaConfiguration/mandatoryAttributes', value: ['qname'] },
      ]),
    )
  })
})

describe('ConfigApiPropertiesForm opening', () => {
  it('shows the simple fields before the lists and nested settings', () => {
    const commits: Array<{ simpleShown: boolean; restShown: boolean }> = []
    const recordCommit = () =>
      commits.push({
        simpleShown: document.querySelector('[data-testid="loggingLevel"]') !== null,
        restShown: document.querySelector('[title="https://one.example"]') !== null,
      })
    render(
      <Profiler id="config-api-form" onRender={recordCommit}>
        <ConfigApiPropertiesForm configuration={configuration} onSubmit={jest.fn()} />
      </Profiler>,
      { wrapper: AppTestWrapper },
    )

    expect(screen.getByTitle('https://one.example')).toBeInTheDocument()
    expect(screen.getByTitle('source')).toBeInTheDocument()
    expect(commits.some((commit) => commit.simpleShown && !commit.restShown)).toBe(true)
  })
})
