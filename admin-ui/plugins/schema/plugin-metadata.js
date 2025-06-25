import AttributeListPage from 'Plugins/schema/components/Person/AttributeListPage'
import AttributeAddPage from 'Plugins/schema/components/Person/AttributeAddPage'
import AttributeEditPage from 'Plugins/schema/components/Person/AttributeEditPage'
import AttributeViewPage from 'Plugins/schema/components/Person/AttributeViewPage'
import { reducer as attributeReducer } from 'Plugins/schema/redux/features/attributeSlice'
import attributeSaga from 'Plugins/schema/redux/sagas/AttributeSaga'
import { ATTRIBUTE_READ, ATTRIBUTE_WRITE } from 'Utils//PermChecker'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.user_claims',
      icon: 'user_claims',
      path: '/attributes',
      permission: ATTRIBUTE_READ,
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
