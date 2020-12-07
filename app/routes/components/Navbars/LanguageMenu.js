import React, { useState } from "react";
//import { useTranslation } from "react-i18next";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown
} from "../../../components";

const LanguageMenu = () => {
  const [isOpen, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  // const { t, i18n } = useTranslation();
  const toggle = () => setOpen(!isOpen);
  function changeLanguage(code) {
    //i18n.changeLanguage(code);
    setLang(code);
  }
  return (
    <ButtonDropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle caret color="primary">
        {lang}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => changeLanguage("fr")}>
          {"french"}
        </DropdownItem>
        <DropdownItem onClick={() => changeLanguage("en")}>
          {"english"}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};
export { LanguageMenu };
