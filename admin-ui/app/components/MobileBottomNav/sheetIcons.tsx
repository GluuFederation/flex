import type { JSX } from 'react'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import {
  HomeIcon,
  OAuthIcon,
  UsersIcon,
  ScriptsIcon,
  UserClaimsIcon,
  ServicesIcon,
  SmtpZoneIcon,
  ScimIcon,
  FidoIcon,
  LockIcon,
} from '../SVG'

const ICON_CLASS = 'mobile-nav-icon'

export const PRIMARY_ICON_BY_KEY: Record<string, JSX.Element> = {
  home: <HomeIcon className={ICON_CLASS} />,
  oauthserver: <OAuthIcon className={ICON_CLASS} />,
  usersmanagement: <UsersIcon className={ICON_CLASS} />,
}

export const SHEET_ICON_BY_KEY: Record<string, JSX.Element> = {
  ...PRIMARY_ICON_BY_KEY,
  scripts: <ScriptsIcon className={ICON_CLASS} />,
  user_claims: <UserClaimsIcon className={ICON_CLASS} />,
  services: <ServicesIcon className={ICON_CLASS} />,
  smtpmanagement: <SmtpZoneIcon className={ICON_CLASS} />,
  scim: <ScimIcon className={ICON_CLASS} />,
  fidomanagement: <FidoIcon className={ICON_CLASS} />,
  jans_lock: <LockIcon className={ICON_CLASS} />,
  notification: <NotificationsNoneOutlinedIcon className={ICON_CLASS} />,
}
