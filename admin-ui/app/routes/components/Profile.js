import React, { useContext } from "react"
import { Avatar, Badge } from "Components"
import { ThemeContext } from 'Context/theme/themeContext'
import { randomAvatar } from "./../../utilities"
import getThemeColor from "../../context/theme/config"

const Profile = ({ userinfo }) => {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(theme.state.theme)

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center my-3">
        <Avatar.Image size="lg" src={randomAvatar()} />
      </div>
      <div className="mb-4 text-center">
        <div className="text-center mt-2">{userinfo.name}</div>
        <Badge color={`primary-${selectedTheme}`}>
          <span style={{ color: themeColors.fontColor }}>{userinfo.jansAdminUIRole}</span>
        </Badge>
        <div className="text-center">
          <i className="fa fa-mail-forward mr-1"></i>
          {userinfo.email}
        </div>
      </div>
    </React.Fragment>
  )
}

export { Profile }
