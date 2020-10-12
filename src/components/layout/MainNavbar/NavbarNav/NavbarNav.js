import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";
import LanguageSelector from "./LanguageSelector";

export default () => (
  <Nav navbar className="border-left flex-row">
    <LanguageSelector />
    <Notifications />
    <UserActions />
  </Nav>
);
