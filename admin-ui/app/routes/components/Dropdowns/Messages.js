import React from 'react';

import { 
  Avatar, 
  AvatarAddOn,
  Media
} from './../../../components';
import { randomArray, randomAvatar } from './../../../utilities';
import { useTranslation } from 'react-i18next';

const status = [
  "success",
  "danger",
  "warning",
  "secondary"
];

const Messages = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Media>
        <Media left className="mr-4">
          <Avatar.Image
            size="md"
            src={ randomAvatar() }
            addOns={[
              <AvatarAddOn.Icon 
                className="fa fa-circle"
                color="white"
                key="avatar-icon-bg"
              />,
              <AvatarAddOn.Icon 
                className="fa fa-circle"
                color={ randomArray(status) }
                key="avatar-icon-fg"
              />
            ]}
          />
        </Media>
        <Media body className="text-left">
          <span className="d-flex justify-content-start">
            <span className="h6 pb-0 mb-0 d-flex align-items-center">
              { 'faker.name.firstName()' } { 'faker.name.lastName()' }
            </span>
                      
            <span className="ml-1 small">(23)</span>
            <span className="ml-auto small">{t("Now")}</span>
          </span>
          <p className="mt-2 mb-1">
            { 'faker.name.firstName()' }
          </p>
          <span className="small">
            { 'faker.date.past().toString()' }
          </span>
        </Media>
      </Media>
    </React.Fragment>

  );
};

export { Messages };
