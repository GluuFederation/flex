import AttributeListPage from 'Plugins/schema/components/Person/AttributeListPage'
import AttributeAddPage from 'Plugins/schema/components/Person/AttributeAddPage'
import AttributeEditPage from 'Plugins/schema/components/Person/AttributeEditPage'
import AttributeViewPage from 'Plugins/schema/components/Person/AttributeViewPage'
import { ATTRIBUTE_READ, ATTRIBUTE_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.user_claims',
      icon: 'user_claims',
      path: '/attributes',
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  routes: [
    {
      component: AttributeEditPage,
      path: '/attribute/edit/:gid',
      permission: ATTRIBUTE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: AttributeViewPage,
      path: '/attribute/view/:gid',
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: AttributeAddPage,
      path: '/attribute/new',
      permission: ATTRIBUTE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: AttributeListPage,
      path: '/attributes',
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
