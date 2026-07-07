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

export const SHEET_ICON_BY_KEY: Record<string, JSX.Element> = {
  home: <HomeIcon className="mobile-sheet-icon" />,
  oauthserver: <OAuthIcon className="mobile-sheet-icon" />,
  usersmanagement: <UsersIcon className="mobile-sheet-icon" />,
  scripts: <ScriptsIcon className="mobile-sheet-icon" />,
  user_claims: <UserClaimsIcon className="mobile-sheet-icon" />,
  services: <ServicesIcon className="mobile-sheet-icon" />,
  smtpmanagement: <SmtpZoneIcon className="mobile-sheet-icon" />,
  scim: <ScimIcon className="mobile-sheet-icon" />,
  fidomanagement: <FidoIcon className="mobile-sheet-icon" />,
  jans_lock: <LockIcon className="mobile-sheet-icon" />,
  notification: <NotificationsNoneOutlinedIcon className="mobile-sheet-icon" />,
}
