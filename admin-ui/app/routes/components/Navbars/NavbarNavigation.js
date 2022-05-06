import React from 'react'
import PropTypes from 'prop-types'
import { NavLink as Link } from 'react-router-dom'
import classNames from 'classnames'

import { 
  Nav,
  DropdownToggle,
  NavLink,
  UncontrolledDropdown,
  NavItem,
  DropdownMenu,
  DropdownItem,
  NestedDropdown
} from './../../../components'
import { useTranslation } from 'react-i18next'

const NavbarNavigation = ({ accent, pills, ...navbarProps }) => {
  const { t } = useTranslation()
  return (
    <Nav navbar accent={ accent } pills={ pills } { ...navbarProps }>
      <NavItem>
        <NavLink tag={ Link } to="/interface/navbars">
          <span className={ classNames({ 'mr-3': !(pills || accent) }) }>
            <i className="fa fa-fw fa-home d-none d-md-inline"></i>
            <span className="d-md-none">
              {t("Home")}
            </span>
          </span>
        </NavLink>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          {t("Dashboards")}
          <i className="fa fa-angle-down fa-fw ml-1"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={ Link } to="/dashboards/analytics">{t("Analytics")}</DropdownItem>
          <DropdownItem tag={ Link } to="/dashboards/projects">{t("Projects")}</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          {t("Interface")}
          <i className="fa fa-angle-down fa-fw ml-1"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={ Link } to="/interface/colors">{t("Colors")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/typography">{t("Typography")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/buttons">{t("Buttons")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/paginations">{t("Paginations")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/images">{t("Images")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/avatars">{t("Avatars")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/progressbars">{t("Progress Bars")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/badgeslabels">{t("Badges")+"&"+t("Labels")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/mediaobjects">{t("Media Objects")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/listgroups">{t("List Groups")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/alerts">{t("Alerts")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/accordions">{t("Accordions")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/tabspills">{t("Tabs Pills")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/tooltipspopovers">{t("Tooltips Popovers")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/dropdowns">{t("Dropdowns")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/dropdowns">{t("Modals")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/breadcrumbs">{t("Breadcrumbs")}</DropdownItem>
          <DropdownItem tag={ Link } to="/interface/navbars">{t("Navbars")}</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      <NestedDropdown nav inNavbar>
        <DropdownToggle nav>
          {t("Apps")}
          <i className="fa fa-angle-down fa-fw ml-1"></i>
        </DropdownToggle>
        <DropdownMenu>
          <NestedDropdown.Submenu title={t("Projects")}>
            <DropdownItem tag={ Link } to="/apps/projects/list">{t("Projects List")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/projects/grid">{t("Projects Grid")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Tasks")}>
            <DropdownItem tag={ Link } to="/apps/tasks/list">{t("Tasks List")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/tasks/grid">{t("Tasks Grid")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/tasks/kanban">{t("Tasks Kanban")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/tasks/details">{t("Task Details")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Files")}>
            <DropdownItem tag={ Link } to="/apps/files/list">{t("Files List")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/files/grid">{t("Files Grid")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Search Results")}>
            <DropdownItem tag={ Link } to="/apps/search-results">{t("Search Results")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/images-results">{t("Images Results")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/videos-results">{t("Videos Results")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/users-results">{t("Users Results")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Users")}>
            <DropdownItem tag={ Link } to="/apps/users/list">{t("Users List")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/users/grid">{t("Users Grid")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Gallery")}>
            <DropdownItem tag={ Link } to="/apps/gallery-grid">{t("Gallery Grid")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/gallery-table">{t("Gallery Table")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Mailbox")}>
            <DropdownItem tag={ Link } to="/apps/inbox">{t("Inbox")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/new-email">{t("New Email")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/email-details">{t("Email Details")}</DropdownItem>
          </NestedDropdown.Submenu>
          <NestedDropdown.Submenu title={t("Profile")}>
            <DropdownItem tag={ Link } to="/apps/profile-details">{t("Profile Details")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/profile-edit">{t("Profile Edit")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/account-edit">{t("Account Edit")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/billing-edit">{t("Billing Edit")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/settings-edit">{t("Settings Edit")}</DropdownItem>
            <DropdownItem tag={ Link } to="/apps/sessions-edit">{t("Sessions Edit")}</DropdownItem>
          </NestedDropdown.Submenu>
          <DropdownItem tag={ Link } to="/apps/clients">{t("Clients")}</DropdownItem>
          <DropdownItem tag={ Link } to="/apps/chat">{t("Chat")}</DropdownItem>
        </DropdownMenu>
      </NestedDropdown>

      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          {t("Layouts")}                                 
          <i className="fa fa-angle-down fa-fw ml-1"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={ Link } to="/layouts/navbar">{t("Navbar")}</DropdownItem>
          <DropdownItem tag={ Link } to="/layouts/sidebar">{t("Sidebar")}</DropdownItem>
          <DropdownItem tag={ Link } to="/layouts/sidebar-with-navbar">{t("Sidebar with Navbar")}</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav>
          <i className="fa fa-ellipsis-h fa-fw"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>{t("Cards")}</DropdownItem>
          <DropdownItem tag={ Link } to="/cards/cards">{t("Cards")}</DropdownItem>
          <DropdownItem tag={ Link } to="/cards/cardsheaders">{t("Cards Headers")}</DropdownItem>
          <DropdownItem divider />
          <DropdownItem header>{t("Layouts")}</DropdownItem>
          <DropdownItem tag={ Link } to="/layouts/navbar-only">{t("Navbar Only")}</DropdownItem>
          <DropdownItem divider />
          <DropdownItem header>{t("Other")}</DropdownItem>
          <DropdownItem tag={ Link } to="/tables/tables">{t("Tables")}</DropdownItem>
          <DropdownItem tag={ Link } to="/icons">{t("Icons")}</DropdownItem>
          <DropdownItem tag={ Link } to="/widgets">{t("Widgets")}</DropdownItem>
          <DropdownItem tag={ Link } to="/graphs/re-charts">{t("Re Charts")}</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Nav>
  )
}
NavbarNavigation.propTypes = {
  pills: PropTypes.bool,
  accent: PropTypes.bool,
}

export { NavbarNavigation }
