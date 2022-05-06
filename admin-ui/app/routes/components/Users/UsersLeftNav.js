import React from 'react'

import { 
  Nav,
  NavItem,
  NavLink,
  Badge
} from './../../../components'
import { useTranslation } from 'react-i18next'

const UsersLeftNav = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      { /* START Left Nav  */}
      <div className="mb-4">
        <Nav pills vertical>
          <NavItem>
            <NavLink href="#" active>
              {t("All Contacts")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              {t("Favorites")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              {t("Private")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      { /* END Left Nav  */}
      { /* START Left Nav  */}
      <div className="mb-4">
        <div className="small mb-3">
          {t("Tags")}
        </div>
        <Nav pills vertical>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-circle text-primary align-self-center mr-2"></i>
              {t("Family")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                12
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-circle text-info align-self-center mr-2"></i>
              {t("Friends")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                3
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-circle text-success align-self-center mr-2"></i>
              {t("Work")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                67
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-circle text-warning align-self-center mr-2"></i>
              {t("Trips")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                5
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-circle text-danger align-self-center mr-2"></i>
              {t("Other")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                1
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              <i className="fa fa-fw fa-plus mr-2"></i>
              {t("Add New Label")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      { /* END Left Nav  */}
    </React.Fragment>
  )
}

export { UsersLeftNav }
