import React from 'react'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { 
  Card,
  CardBody,
  Badge,
  Avatar,
  Media,
  CustomInput,
  CardFooter,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  AvatarAddOn
} from 'Components'

import { randomArray, randomAvatar } from './../../../utilities'
import { useTranslation } from 'react-i18next'

const badgesColors = [
  "secondary"
]

const avatarStatus = [
  "secondary",
  "warning",
  "danger",
  "success"
]

const prioStatus = [
  <React.Fragment key="1">
    <i className="fa fa-circle text-success me-2"></i>
    Small<i className="fa fa-angle-down ms-2" />
  </React.Fragment>,
  <React.Fragment key="2">
    <i className="fa fa-circle text-primary me-2"></i>
    Normal<i className="fa fa-angle-down ms-2" />
  </React.Fragment>,
  <React.Fragment key="3">
    <i className="fa fa-circle text-warning me-2"></i>
    High<i className="fa fa-angle-down ms-2" />
  </React.Fragment>,
  <React.Fragment key="3">
    <i className="fa fa-circle text-danger me-2"></i>
    Big<i className="fa fa-angle-down ms-2" />
  </React.Fragment>
]

const TasksCardGrid = (props) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      { /* START Card */}
      <Card>
        <CardBody>
          <UncontrolledButtonDropdown>
            <DropdownToggle color="link" link size="sm" className="ps-0 mb-3 text-decoration-none">
              { randomArray(prioStatus) }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>{t("Select Priority")}</DropdownItem>
              <DropdownItem>
                <i className="fa fa-circle text-danger me-2"></i>
                {t("Big")} 
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-circle text-warning me-2"></i>
                {t("High")} 
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-circle text-primary me-2"></i>
                {t("Normal")} 
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-circle text-success me-2"></i>
                {t("Small")} 
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <Media className="mb-2">
            <Media left middle className="me-2">
              <CustomInput type="checkbox" id={`TasksCardGrid-${ props.id }` } label="" />
            </Media>
            <Media body>
              <span className="me-2">#{ 'faker.random.number()' }</span>
              <Link to="/apps/task-details" className="text-decoration-none">
                { 'faker.hacker.phrase()' }
              </Link>
            </Media>
          </Media>
          <p className="mb-2">
            { 'faker.lorem.sentence()' }
          </p>
          <div className="mb-3">
            <Badge pill color={ randomArray(badgesColors) } className="me-1">
              { 'faker.commerce.department()' }
            </Badge>
            <Badge pill color={ randomArray(badgesColors) } className="me-1">
              { 'faker.commerce.department()' }
            </Badge>
          </div>
          <div>
            <Avatar.Image
              size="md"
              src={ randomAvatar() }
              className="me-3"
              addOns={[
                <AvatarAddOn.Icon 
                  className="fa fa-circle"
                  color="white"
                  key="avatar-icon-bg"
                />,
                <AvatarAddOn.Icon 
                  className="fa fa-circle"
                  color={ randomArray(avatarStatus) }
                  key="avatar-icon-fg"
                />
              ]}
            />
            <Avatar.Image
              size="md"
              src={ randomAvatar() }
              className="me-3"
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
            <Avatar.Image
              size="md"
              src={ randomAvatar() }
              className="me-3"
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
          </div>
        </CardBody>
        <CardFooter className="d-flex">
          <span className="align-self-center">
            20 Sep, Fri, 2018
          </span>
          <UncontrolledButtonDropdown className="align-self-center ms-auto">
            <DropdownToggle color="link" size="sm" className="pe-0">
              <i className="fa fa-gear" /><i className="fa fa-angle-down ms-2" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <i className="fa fa-fw fa-folder-open me-2"></i>
                {t("View")}
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-fw fa-ticket me-2"></i>
                {t("Add Task")}
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-fw fa-paperclip me-2"></i>
                {t("Add Files")}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-fw fa-trash me-2"></i>
                {t("Delete")}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </CardFooter>
      </Card>
      { /* END Card */}
    </React.Fragment>
  )
}

TasksCardGrid.propTypes = {
  id: PropTypes.node
}
TasksCardGrid.defaultProps = {
  id: "1"
}

export { TasksCardGrid }
