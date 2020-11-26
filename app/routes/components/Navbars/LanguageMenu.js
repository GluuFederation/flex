import React from "react";
import { useTranslation } from "react-i18next";
import {
  UncontrolledDropdown,
  DropdownToggle,
  ListGroupItem,
  ListGroup,
  ExtendedDropdown
} from "../../../components";

const LanguageMenu = props => {
  const { i18n } = useTranslation();
  function handleClick(lang) {
    i18n.changeLanguage(lang);
  }
  return (
    <UncontrolledDropdown nav inNavbar {...props}>
      <DropdownToggle nav>
        <i className="fa fa-envelope-o fa-flag" />
      </DropdownToggle>
      <ExtendedDropdown right>
        <ExtendedDropdown.Section className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Languages</h6>
        </ExtendedDropdown.Section>
        <ExtendedDropdown.Section list>
          <ListGroup>
            <ListGroupItem tag={ExtendedDropdown.Link} key="fr" action>
              fr
            </ListGroupItem>
            <ListGroupItem tag={ExtendedDropdown.Link} key="fr" action>
              en
            </ListGroupItem>
            <ListGroupItem tag={ExtendedDropdown.Link} key="fr" action>
              es
            </ListGroupItem>
          </ListGroup>
        </ExtendedDropdown.Section>
      </ExtendedDropdown>
    </UncontrolledDropdown>
  );
};
export { LanguageMenu };
