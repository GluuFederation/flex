import AttributeListPage from './presentation/pages/AttributeListPage'
import AttributeAddPage from './presentation/pages/AttributeAddPage'
import AttributeEditPage from './presentation/pages/AttributeEditPage'
import AttributeViewPage from './presentation/pages/AttributeViewPage'
import { reducer as attributeReducer } from './domain/redux/features/attributeSlice'
import attributeSaga from './domain/redux/sagas/AttributeSaga'
import { ATTRIBUTE_READ, ATTRIBUTE_WRITE } from 'Utils//PermChecker'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.schema',
      icon: 'schema',
      children: [
        {
          title: 'menus.person',
          path: '/attributes',
          permission: ATTRIBUTE_READ,
        },
      ],
    },
  ],
  routes: [
    {
      component: AttributeEditPage,
      path: '/attribute/edit/:gid',
      permission: ATTRIBUTE_WRITE,
    },
    {
      component: AttributeViewPage,
      path: '/attribute/view/:gid',
      permission: ATTRIBUTE_READ,
    },
    {
      component: AttributeAddPage,
      path: '/attribute/new',
      permission: ATTRIBUTE_WRITE,
    },
    {
      component: AttributeListPage,
      path: '/attributes',
      permission: ATTRIBUTE_READ,
    },
  ],
  reducers: [{ name: 'attributeReducer', reducer: attributeReducer }],
  sagas: [attributeSaga()],
}

export default pluginMetadata
