import React from 'react'
import { render, screen } from '@testing-library/react'
import item from './item.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CustomScriptDetailPage from 'Plugins/admin/components/CustomScripts/CustomScriptDetailPage'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

it('Should render the Custom Script detail page properly', () => {
  render(<CustomScriptDetailPage row={item} />, {
    wrapper: Wrapper,
  })
  const name = item.name
  const script_type = item.scriptType
  expect(screen.getByText(/Inum/i)).toBeInTheDocument()
  expect(screen.getByText(/Location Type/)).toBeInTheDocument()
  expect(screen.getByText(/Script Type/)).toBeInTheDocument()
  expect(screen.getByText(name)).toBeInTheDocument()
  expect(screen.getByText(script_type)).toBeInTheDocument()
})
