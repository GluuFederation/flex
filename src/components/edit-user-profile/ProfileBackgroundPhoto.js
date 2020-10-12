import React from "react";
import { CardHeader, FormInput } from "shards-react";

const ProfileBackgroundPhoto = () => (
  <CardHeader className="p-0">
    <div className="edit-user-details__bg">
      <img
        src={require("../../images/user-profile/up-user-details-background.jpg")}
        alt="User Details Background"
      />
      <label className="edit-user-details__change-background">
        <i className="material-icons mr-1">&#xE439;</i> Change Background Photo
        <FormInput className="d-none" type="file" />
      </label>
    </div>
  </CardHeader>
);

export default ProfileBackgroundPhoto;
