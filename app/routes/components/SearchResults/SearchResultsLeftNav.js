import React from 'react';

import { NavLink as RouterNavLink } from 'react-router-dom';

import { 
  Nav, 
  NavLink,
  NavItem,
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
  CustomInput,
  Badge
} from './../../../components';
import { useTranslation } from 'react-i18next'

const SearchResultsLeftNav = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      { /* START Navigation */}
      <Nav vertical pills className="mb-3">
        <NavItem>
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Navigation")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={ RouterNavLink } to="/apps/search-results" className="d-flex">
            {t("All Results")}
            <Badge pill color="secondary" className="ml-auto align-self-center">
              12
            </Badge>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={ RouterNavLink } to="/apps/images-results" className="d-flex">
            {t("Images")}
            <Badge pill color="secondary" className="ml-auto align-self-center">
              5
            </Badge>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={ RouterNavLink } to="/apps/videos-results" className="d-flex">
            {t("Videos")}
            <Badge pill color="secondary" className="ml-auto align-self-center">
              10
            </Badge>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={ RouterNavLink } to="/apps/users-results" className="d-flex">
            {t("Users")}
            <Badge pill color="secondary" className="ml-auto align-self-center">
              2
            </Badge>
          </NavLink>
        </NavItem>
      </Nav>
      { /* END Navigation */}
      { /* START Category */}
      <Nav vertical className="mb-3">
        <NavItem>
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Category")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#" className="d-flex">
            <span>
              { 'faker.commerce.department()' }
            </span>
            <span className="small ml-auto align-self-center text-body">
              ({ 'faker.finance.mask()' })
            </span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#" className="d-flex">
            <span>
              { 'faker.commerce.department()' }
            </span>
            <span className="small ml-auto align-self-center text-body">
              ({ 'faker.finance.mask()' })
            </span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#" className="d-flex">
            <span>
              { 'faker.commerce.department()' }
            </span>
            <span className="small ml-auto align-self-center text-body">
              ({ 'faker.finance.mask()' })
            </span>
          </NavLink>
        </NavItem>
      </Nav>
      { /* END Category */}
      { /* START Rating */}
      <Nav vertical className="mb-3">
        <NavItem className="mb-2">
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Rating")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="radio" id="radio1" name="rating" label="Clothing" inline defaultChecked />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="radio" id="radio2" name="rating" label="Baby" inline />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="radio" id="radio3" name="rating" label="Jewelery" inline />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="radio" id="radio4" name="rating" label="Games" inline />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
      </Nav>
      { /* END Rating */}
      { /* START Tags */}
      <Nav vertical className="mb-3">
        <NavItem className="mb-2">
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Tags")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="checkbox" id="checkbox1" label="Garden" inline defaultChecked />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="checkbox" id="checkbox2" label="Beauty" inline />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="checkbox" id="checkbox3" label="Clothing" inline />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
        <NavItem className="d-flex px-2 mb-2">
          <CustomInput type="checkbox" id="checkbox4" label="Games" inline />
          <span className="small ml-auto align-self-center">
            ({ 'faker.finance.mask()' })
          </span>
        </NavItem>
      </Nav>
      { /* END Tags */}
      { /* START Price */}
      <Nav vertical className="mb-3">
        <NavItem className="mb-2">
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Price")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem className="d-flex p-0">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              $
            </InputGroupAddon>
            <Input placeholder="Min: 5" className="bg-white" />
            <Input placeholder="Max: 87" className="bg-white" />
            <InputGroupAddon addonType="append">
              <Button color="secondary" outline>
                <i className="fa fa-check"></i>
              </Button>
            </InputGroupAddon> 
          </InputGroup>
        </NavItem>
      </Nav>
      { /* END Price */}
      { /* START Shipping */}
      <Nav vertical className="mb-3">
        <NavItem className="mb-2">
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Shipping")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem className="d-flex p-0">
          <CustomInput type="select" name="select" id="shipping">
            <option>{t("England")}</option>
            <option>{t("United States")}</option>
            <option>{t("Canada")}</option>
            <option>{t("Australia")}</option>
            <option>{t("Other")}...</option>
          </CustomInput>
        </NavItem>
      </Nav>
      { /* END Shipping */}
      { /* START Sales */}
      <Nav vertical className="mb-4">
        <NavItem className="mb-2">
          <NavLink href="#" className="small d-flex px-1">
            <span>
              {t("Sales")}
            </span>
            <i className="fa fa-angle-down align-self-center ml-auto"></i>
          </NavLink>
        </NavItem>
        <NavItem className="d-flex p-0">
          <CustomInput type="select" name="select" id="sales">
            <option>{t("England")}</option>
            <option>{t("United States")}</option>
            <option>{t("Canada")}</option>
            <option>{t("Australia")}</option>
            <option>{t("Other")}...</option>
          </CustomInput>
        </NavItem>
      </Nav>
      { /* END Sales */}
      <Button color="primary" block>
        {t("Confirm Changes")}
      </Button>
      <Button color="link" block>
        {t("Reset to Default")}
      </Button>
    </React.Fragment>
  );
}

export { SearchResultsLeftNav };
