import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const SmtpEditPage = createLazyRoute(() => import('./components/SmtpEditPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.smtp',
      icon: 'smtpmanagement',
      path: ROUTES.SMTP_BASE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SMTP,
    },
  ],
  routes: [
    {
      component: SmtpEditPage,
      path: ROUTES.SMTP_BASE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SMTP,
    },
  ],
  reducers: [],
}

export default pluginMetadata
