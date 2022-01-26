import React from "react";

import { Avatar, Badge } from "./../../components";

import { randomAvatar } from "./../../utilities";

const Profile = ({ userinfo }) => {
  return (
    <React.Fragment>
      <div className="d-flex justify-content-center my-3">
        <Avatar.Image size="lg" src={randomAvatar()} />
      </div>
      <div className="mb-4 text-center">
        <div className="text-center mt-2">{userinfo.name}</div>
        <Badge color="primary">{userinfo.jansAdminUIRole}</Badge>
        <div className="text-center">
          <i className="fa fa-mail-forward mr-1"></i>
          {userinfo.email}
        </div>
      </div>
    </React.Fragment>
  );
};

export { Profile };
