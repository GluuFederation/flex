import StudionMainPage from './components/Person/StudionMainPage'
import attributeReducer from './redux/reducers/AttributeReducer'
import attributeSaga from './redux/sagas/AttributeSaga'
import { ATTRIBUTE_READ } from 'Utils/PermChecker'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.studio',
      icon: 'schema',
      path: '/studio',
      permission: ATTRIBUTE_READ,
    },
  ],
  routes: [
    {
      component: StudionMainPage,
      path: '/studio',
      permission: ATTRIBUTE_READ,
    },
  ],
  reducers: [{ name: 'attributeReducer', reducer: attributeReducer }],
  sagas: [attributeSaga()],
}

export default pluginMetadata
