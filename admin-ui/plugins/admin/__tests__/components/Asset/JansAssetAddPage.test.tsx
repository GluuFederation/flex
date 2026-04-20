import { render, screen } from '@testing-library/react'
import { createAssetTestStore, createAssetTestWrapper } from './assetTestUtils'
import JansAssetAddPage from 'Plugins/admin/components/Assets/JansAssetAddPage'

const store = createAssetTestStore()
const Wrapper = createAssetTestWrapper(store)

describe('JansAssetAddPage', () => {
  it('renders the asset add page with form fields', async () => {
    render(<JansAssetAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Description/i)).toBeInTheDocument()
  })
})
