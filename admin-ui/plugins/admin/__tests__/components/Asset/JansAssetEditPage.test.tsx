import { render, screen } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import {
  createAssetTestStore,
  createAssetTestQueryClient,
  createAssetTestWrapper,
} from './assetTestUtils'
import JansAssetEditPage from 'Plugins/admin/components/Assets/JansAssetEditPage'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ id: 'test-inum-123' })),
}))

const assetReducerState = {
  assets: [],
  services: [],
  fileTypes: [],
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  selectedAsset: {
    inum: 'test-inum-123',
    fileName: 'test-asset',
    description: 'Test asset description',
    service: 'test-service',
    enabled: true,
  },
  loadingAssets: false,
  assetModal: false,
  showErrorModal: false,
}

describe('JansAssetEditPage', () => {
  let store: ReturnType<typeof createAssetTestStore>
  let queryClient: QueryClient
  let Wrapper: ReturnType<typeof createAssetTestWrapper>

  beforeEach(() => {
    queryClient = createAssetTestQueryClient()
    store = createAssetTestStore(assetReducerState)
    Wrapper = createAssetTestWrapper(store, queryClient)
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('renders the asset edit page with form fields', async () => {
    render(<JansAssetEditPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Description/i)).toBeInTheDocument()
  })
})
