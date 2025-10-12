import SmtpEditPage from './components/SmtpManagement/SmtpEditPage'
import { SMTP_READ, SMTP_WRITE } from '../../app/utils/PermChecker'

const PLUGIN_BASE_PATH = '/smtp'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.smtp',
      icon: 'stmpmanagement',
      path: PLUGIN_BASE_PATH + '/smtpmanagement',
      permission: SMTP_READ,
    },
  ],
  routes: [
    {
      component: SmtpEditPage,
      path: PLUGIN_BASE_PATH + '/smtpmanagement',
      permission: SMTP_WRITE,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
