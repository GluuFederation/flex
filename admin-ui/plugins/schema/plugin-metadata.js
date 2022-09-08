import AttributeListPage from './components/Person/AttributeListPage'
import AttributeAddPage from './components/Person/AttributeAddPage'
import AttributeEditPage from './components/Person/AttributeEditPage'
import AttributeViewPage from './components/Person/AttributeViewPage'
import attributeReducer from './redux/reducers/AttributeReducer'
import attributeSaga from './redux/sagas/AttributeSaga'
import BlockFlowPage from './components/BlockFlow/BlockFlowPage'
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
        {
          title: 'menus.blockFlow',
          path: '/block-flow',
          permission: ATTRIBUTE_READ,
        },
      ],
    },
  ],
  routes: [
    {
      component: AttributeEditPage,
      path: '/attribute/edit:gid',
      permission: ATTRIBUTE_WRITE,
    },
    {
      component: AttributeViewPage,
      path: '/attribute/view:gid',
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
    {
      component: BlockFlowPage,
      path: '/block-flow',
      permission: ATTRIBUTE_READ,
    },
  ],
  reducers: [{ name: 'attributeReducer', reducer: attributeReducer }],
  sagas: [attributeSaga()],
}

export default pluginMetadata
