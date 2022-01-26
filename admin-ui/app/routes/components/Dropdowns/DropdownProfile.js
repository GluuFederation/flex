import React from 'react'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { DropdownMenu, DropdownItem } from './../../../components'
import { useTranslation } from 'react-i18next'

const DropdownProfile = (props) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <DropdownMenu right={props.right}>
        <DropdownItem header>
          {props.userinfo.user_name || props.userinfo.name || props.userinfo.given_name}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/profile">
          {t("menus.my_profile")}
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/logout">
          <i className="fa fa-fw fa-sign-out mr-2"></i>
          {t("menus.signout")}
        </DropdownItem>
      </DropdownMenu>
    </React.Fragment>
  )
}
DropdownProfile.propTypes = {
  position: PropTypes.string,
  right: PropTypes.bool,
}
DropdownProfile.defaultProps = {
  position: '',
}

export { DropdownProfile }
