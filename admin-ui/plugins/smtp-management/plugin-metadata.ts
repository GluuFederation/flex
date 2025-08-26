import SmtpEditPage from './components/SmtpManagement/StmpEditPage'
import smtpReducer from './redux/features/smtpSlice'
import smtpSaga from './redux/sagas/SmtpSaga'
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
  reducers: [{ name: 'stmpReducer', reducer: smtpReducer }],
  sagas: [smtpSaga()],
}

export default pluginMetadata
