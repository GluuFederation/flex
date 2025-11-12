import SmtpEditPage from './components/SmtpManagement/SmtpEditPage'
import { SMTP_READ, SMTP_WRITE } from '../../app/utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const PLUGIN_BASE_PATH = '/smtp'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.smtp',
      icon: 'stmpmanagement',
      path: PLUGIN_BASE_PATH + '/smtpmanagement',
      permission: SMTP_READ,
      resourceKey: ADMIN_UI_RESOURCES.SMTP,
    },
  ],
  routes: [
    {
      component: SmtpEditPage,
      path: PLUGIN_BASE_PATH + '/smtpmanagement',
      permission: SMTP_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SMTP,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
