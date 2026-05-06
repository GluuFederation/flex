import { SMTP_READ, SMTP_WRITE } from '../../app/utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const SmtpEditPage = createLazyRoute(() => import('./components/SmtpEditPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.smtp',
      icon: 'smtpmanagement',
      path: ROUTES.SMTP_BASE,
      permission: SMTP_READ,
      resourceKey: ADMIN_UI_RESOURCES.SMTP,
    },
  ],
  routes: [
    {
      component: SmtpEditPage,
      path: ROUTES.SMTP_BASE,
      permission: SMTP_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SMTP,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
