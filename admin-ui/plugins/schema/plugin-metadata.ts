import AttributeListPage from 'Plugins/schema/components/Person/AttributeListPage'
import AttributeAddPage from 'Plugins/schema/components/Person/AttributeAddPage'
import AttributeEditPage from 'Plugins/schema/components/Person/AttributeEditPage'
import AttributeViewPage from 'Plugins/schema/components/Person/AttributeViewPage'
import { ATTRIBUTE_READ, ATTRIBUTE_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.user_claims',
      icon: 'user_claims',
      path: ROUTES.ATTRIBUTES_LIST,
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  routes: [
    {
      component: AttributeEditPage,
      path: ROUTES.ATTRIBUTE_EDIT_TEMPLATE,
      permission: ATTRIBUTE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: AttributeViewPage,
      path: ROUTES.ATTRIBUTE_VIEW_TEMPLATE,
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: AttributeAddPage,
      path: ROUTES.ATTRIBUTE_ADD,
      permission: ATTRIBUTE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: AttributeListPage,
      path: ROUTES.ATTRIBUTES_LIST,
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
