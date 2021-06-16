import React from 'react';

import { 
  InputGroup,
  Button,
  Input,
  InputGroupAddon,
  Nav,
  NavItem,
  NavLink,
  Badge,
  Media,
  Avatar
} from './../../../components';
import { randomAvatar } from './../../../utilities';
import { useTranslation } from 'react-i18next'

const ProjectsLeftNav = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      { /* START Left Nav  */}
      <div className="mb-4">
        <div className="small mb-3">
          {t("Search")}
        </div>
        <InputGroup>
          <Input placeholder="Search for..." className="bg-white" />
          <InputGroupAddon addonType="append">
            <Button outline color="secondary">
              <i className="fa fa-search"></i>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      { /* END Left Nav  */}
      { /* START Left Nav  */}
      <div className="mb-4">
        <div className="small mb-3">
          {t("Favorites")}
        </div>
        <Nav pills vertical>
          <NavItem>
            <NavLink href="#" active>
              <i className="fa fa-fw fa-line-chart mr-2"></i>
              {t("Overview")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              <i className="fa fa-fw fa-calendar-o mr-2"></i>
              {t("Calendar")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      { /* END Left Nav  */}
      { /* START Left Nav  */}
      <div className="mb-4">
        <div className="small mb-3">
          {t("Projects")}
        </div>
        <Nav pills vertical>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-star-o align-self-center mr-2"></i>
              {t("Analytics Redesign")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                12
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-star-o align-self-center mr-2"></i>
              {t("New Website")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                4
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <i className="fa fa-fw fa-star-o align-self-center mr-2"></i>
              {t("Chart for Newsletter")}
              <Badge color="secondary" pill className="ml-auto align-self-center">
                9
              </Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              <i className="fa fa-fw fa-plus mr-2"></i>
              {("Add New Project")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      { /* END Left Nav  */}
      { /* START Left Nav  */}
      <div className="mb-4">
        <div className="small mb-3">
          {t("People")}
        </div>
        <Nav pills vertical>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <Media>
                <Media left middle className="mr-3 align-self-center">
                  <Avatar.Image
                    size="md"
                    src={ randomAvatar() }
                  />
                </Media>
                <Media body>
                  <div className="mt-0">
                    { 'faker.name.firstName()' } { 'faker.name.lastName()' }
                  </div>
                  <span className="small">
                    { 'faker.address.state()' }, { 'faker.address.stateAbbr()' }
                  </span>
                </Media>
              </Media>
              <i className="fa fa-fw fa-circle text-success ml-auto align-self-center ml-2"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <Media>
                <Media left middle className="mr-3 align-self-center">
                  <Avatar.Image
                    size="md"
                    src={ randomAvatar() }
                  />
                </Media>
                <Media body>
                  <div className="mt-0">
                    { 'faker.name.firstName()' } { 'faker.name.lastName()' }
                  </div>
                  <span className="small">
                    { 'faker.address.state()' }, { 'faker.address.stateAbbr()' }
                  </span>
                </Media>
              </Media>
              <i className="fa fa-fw fa-circle text-warning ml-auto align-self-center ml-2"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" className="d-flex">
              <Media>
                <Media left middle className="mr-3 align-self-center">
                  <Avatar.Image
                    size="md"
                    src={ randomAvatar() }
                  />
                </Media>
                <Media body>
                  <div className="mt-0">
                    { 'faker.name.firstName()' } { 'faker.name.lastName()' }
                  </div>
                  <span className="small">
                    { 'faker.address.state()' }, { 'faker.address.stateAbbr()' }
                  </span>
                </Media>
              </Media>
              <i className="fa fa-fw fa-circle text-danger ml-auto align-self-center ml-2"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              <i className="fa fa-fw fa-plus mr-2"></i>
              {t("Add New People")}
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      { /* END Left Nav  */}
    </React.Fragment>
  );
}

export { ProjectsLeftNav };
