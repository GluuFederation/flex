import React from 'react'
import PropTypes from 'prop-types'
import { 
  Card,
  CardBody,
  Button,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  CardFooter,
  CustomInput,
  ButtonGroup,
  DropdownItem
} from 'Components'

import {
  Profile
} from "./../Profile"
import { useTranslation } from 'react-i18next'

const UsersCardGrid = (props) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      { /* START Card */}
      <Card>
        <CardBody>
          <div className="d-flex">
            <CustomInput className="pt-0 mt-0" type="checkbox" id={`usersCardGrid-${ props.id }` } label="" />
            <ButtonGroup size="sm" className="ms-auto">
              <Button color="link" size="sm" id={`usersCardGridTooltip-${ props.id }` } className="pt-0">
                <i className="fa fa-star-o"></i>
              </Button>
              <UncontrolledTooltip placement="top" target={`usersCardGridTooltip-${ props.id }` }>
                {t("Add To Favorites")}
              </UncontrolledTooltip>
              <UncontrolledButtonDropdown className="ms-auto">
                <DropdownToggle color="link" size="sm" className="pt-0">
                  <i className="fa fa-fw fa-bars pe-0" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <i className="fa fa-fw fa-phone me-2"></i>
                    {t("Call")}
                  </DropdownItem>
                  <DropdownItem>
                    <i className="fa fa-fw fa-comment me-2"></i>
                    {t("Chat")}
                  </DropdownItem>
                  <DropdownItem>
                    <i className="fa fa-fw fa-video-camera me-2"></i>
                    {t("Video")}
                  </DropdownItem>
                  <DropdownItem>
                    <i className="fa fa-fw fa-user me-2"></i>
                    {t("Profile")}
                  </DropdownItem>
                  <DropdownItem>
                    <i className="fa fa-fw fa-pencil me-2"></i>
                    {t("Edit")}
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <i className="fa fa-fw fa-trash me-2"></i>
                    {t("Delete")}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </ButtonGroup>
          </div>
          <Profile />
        </CardBody>
        <CardFooter className="bt-0 text-center">
          <span>
            <span className="me-3">
              <i className="fa fa-user-o me-1"></i> <span className="text-inverse">233</span> 
            </span>
            <span>
              <i className="fa fa-star-o me-1"></i> <span className="text-inverse">98</span>
            </span>
          </span>
        </CardFooter>
      </Card>
      { /* END Card */}
    </React.Fragment>
  )
}
UsersCardGrid.propTypes = {
  id: PropTypes.node
}
UsersCardGrid.defaultProps = {
  id: "1"
}

export { UsersCardGrid }
