import React, { useState } from "react";
import i18n from "../../../../i18n";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import { store } from "../../../../redux/store/store";
import DropdownButton from "react-bootstrap/DropdownButton";
import { NavItem } from "shards-react";
import { changeLanguageAction } from "../../../../redux/actions/UiActions";

const LanguageSelector = ({ lang }) => {
  function changeLanguage(lng) {
    i18n.changeLanguage(lng);
    store.dispatch(changeLanguageAction(lng));
  }
  return (
    <NavItem>
      <DropdownButton
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          backgroundColor: "red !important"
        }}
        id="dropdown-item-button"
        title={lang}
        size="sm"
      >
        <Dropdown.Item onSelect={() => changeLanguage("en")}>en</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onSelect={() => changeLanguage("fr")}>fr</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onSelect={() => changeLanguage("ru")}>ru</Dropdown.Item>
      </DropdownButton>
    </NavItem>
  );
};
function mapStateToProps(state) {
  return {
    lang: state.application.lang
  };
}
export default connect(mapStateToProps)(LanguageSelector);
