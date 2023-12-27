import React from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { 
  Nav,
  NavItem,
  NavLink
} from 'Components'
import { useTranslation } from 'react-i18next'

const ProfileLeftNav = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      { /* START Left Nav  */}
      <div className="mb-4">
        <Nav pills vertical>
          <NavItem>
            <NavLink tag={ RouterNavLink } to="/apps/profile-edit">
              {t("Profile Edit")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={ RouterNavLink } to="/apps/account-edit">
              {t("Account Edit")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={ RouterNavLink } to="/apps/billing-edit">
              {t("Billing Edit")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={ RouterNavLink } to="/apps/settings-edit">
              {t("Settings Edit")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={ RouterNavLink } to="/apps/sessions-edit">
              {t("Sessions Edit")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      { /* END Left Nav  */}
    </React.Fragment>
  )
}

export { ProfileLeftNav }
