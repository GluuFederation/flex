import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { 
  Badge,
  Media,
  Avatar,
  AvatarAddOn
} from 'Components'
import { randomAvatar } from './../../../utilities'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'

const ProfileHeader = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  return (
    <React.Fragment>
      { /* START Header */}
      <Media className="mb-3">
        <Media left middle className="mr-3 align-self-center">
          <Avatar.Image
            size="lg"
            src={ randomAvatar() }
            className="mr-2"
            addOns={[
              <AvatarAddOn.Icon 
                className="fa fa-circle"
                color="white"
                key="avatar-icon-bg"
              />,
              <AvatarAddOn.Icon 
                className="fa fa-circle"
                color="success"
                key="avatar-icon-fg"
              />
            ]}
          />
        </Media>
        <Media body>
          <h5 className="mb-1 mt-0">
            <Link to="/apps/profile-details">
              { 'faker.name.firstName()' } { 'faker.name.lastName()' }
            </Link> <span className="text-muted mx-1"> / </span> {t("Profile Edit")}
          </h5>
          <Badge color={`primary-${selectedTheme}`} pill className="mr-2">{t("Premium")}</Badge> 
          <span className="text-muted">{t("Edit Your Name, Avatar, etc.")}</span>
        </Media>
      </Media>
      { /* END Header */}
    </React.Fragment>
  )
}

export { ProfileHeader }
