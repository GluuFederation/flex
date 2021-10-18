import React from 'react'
import renderer from 'react-test-renderer'
import ClientListPage from './ClientListPage'

test('List OpenId Connect Clients', () => {
  const component = renderer.create(<ClientListPage />)
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  expect(tree).toMatchSnapshot()
})
