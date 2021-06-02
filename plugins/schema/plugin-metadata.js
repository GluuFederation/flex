import AttributeListPage from './components/Person/AttributeListPage'
import AttributeAddPage from './components/Person/AttributeAddPage'
import AttributeEditPage from './components/Person/AttributeEditPage'
import AttributeViewPage from './components/Person/AttributeViewPage'
import attributeReducer from './redux/reducers/AttributeReducer'
import attributeSaga from './redux/sagas/AttributeSaga'

const pluginMetadata = {
  menus: [
    {
      title: 'Schema',
      icon: 'fa-database',
      children: [
        {
          title: 'Person',
          path: '/attributes',
          permission: '/config/attributes.readonly',
        },
      ],
    },
  ],
  routes: [
    {
      component: AttributeEditPage,
      path: '/attribute/edit:gid',
      permission: '/config/attributes.write',
    },
    {
      component: AttributeViewPage,
      path: '/attribute/view:gid',
      permission: '/config/attributes.readonly',
    },
    {
      component: AttributeAddPage,
      path: '/attribute/new',
      permission: '/config/attributes.write',
    },
    {
      component: AttributeListPage,
      path: '/attributes',
      permission: '/config/attributes.readonly',
    },
  ],
  reducers: [
    { name: 'attributeReducer', reducer: attributeReducer },
  ],
  sagas: [
    attributeSaga(),
  ],
}

export default pluginMetadata
