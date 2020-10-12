import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import UserClaimTabItem from "./UserClaimTabItem";

const UserClaimsTab = ({ handler }) => {
  const [key, setKey] = useState(null);
  const data = ["appartment", "country", "phoneNumber"];
  return (
    <Tabs id="aCustomTab" activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="gluuPerson" title="GluuPerson">
        <UserClaimTabItem handler={handler} data={data} />
      </Tab>
      <Tab eventKey="gluuCustomPerson" title="GluuCustomPerson">
        <UserClaimTabItem handler={handler} data={data} />
      </Tab>
      <Tab eventKey="eduPerson" title="EduPerson">
        <UserClaimTabItem handler={handler} data={data} />
      </Tab>
    </Tabs>
  );
};

export default UserClaimsTab;
