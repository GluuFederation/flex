import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
  UncontrolledDropdown,
  DropdownToggle,
  IconWithBadge,
  Badge,
  ExtendedDropdown,
  ListGroup,
  ListGroupItem,
  Media,
} from 'Components'
import { ExtendedDropdownSection } from '@/components/ExtendedDropdown/ExtendedDropdownSection'
import type { NavbarActivityFeedProps, ActivityFeedIconMap } from './types'

const activityFeedIcons: ActivityFeedIconMap = {
  success: (
    <span className="fa-stack fa-lg fa-fw d-flex me-3">
      <i className="fa fa-circle fa-fw fa-stack-2x text-success"></i>
      <i className="fa fa-check fa-stack-1x fa-fw text-white"></i>
    </span>
  ),
  danger: (
    <span className="fa-stack fa-lg fa-fw d-flex me-3">
      <i className="fa fa-circle fa-fw fa-stack-2x text-danger"></i>
      <i className="fa fa-close fa-stack-1x fa-fw text-white"></i>
    </span>
  ),
  warning: (
    <span className="fa-stack fa-lg fa-fw d-flex me-3">
      <i className="fa fa-circle fa-fw fa-stack-2x text-warning"></i>
      <i className="fa fa-exclamation fa-stack-1x fa-fw text-white"></i>
    </span>
  ),
  info: (
    <span className="fa-stack fa-lg fa-fw d-flex me-3">
      <i className="fa fa-circle fa-fw fa-stack-2x text-primary"></i>
      <i className="fa fa-info fa-stack-1x fa-fw text-white"></i>
    </span>
  ),
}

const iconTypes: Array<keyof ActivityFeedIconMap> = ['success', 'danger', 'warning', 'info']

const NavbarActivityFeed: React.FC<NavbarActivityFeedProps> = (props) => (
  <UncontrolledDropdown nav inNavbar {...props}>
    <DropdownToggle nav>
      <IconWithBadge
        badge={
          <Badge pill color="white">
            2
          </Badge>
        }
      >
        <i className="fa fa-bell-o fa-fw" style={{ color: 'white' }} />
      </IconWithBadge>
    </DropdownToggle>
    <ExtendedDropdown right className="">
      <ExtendedDropdownSection className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Activity Feed</h6>
        <Badge pill>2</Badge>
      </ExtendedDropdownSection>

      <ExtendedDropdownSection list>
        <ListGroup>
          {_.times(2, (index) => {
            const iconType = iconTypes[index % iconTypes.length]
            return (
              <ListGroupItem key={index} action>
                <Media>
                  <Media left>{activityFeedIcons[iconType]}</Media>
                  <Media body>
                    <span className="h6">
                      {'faker.name.firstName()'} {'faker.name.lastName()'}
                    </span>{' '}
                    changed Description to &quot;{'faker.random.words()'}&quot;
                    <p className="mt-2 mb-1">{'faker.lorem.sentence()'}</p>
                    <div className="small mt-2">{'faker.date.past().toString()'}</div>
                  </Media>
                </Media>
              </ListGroupItem>
            )
          })}
        </ListGroup>
      </ExtendedDropdownSection>

      <ExtendedDropdownSection className="text-center" tag={Link} to="/apps/widgets">
        See All Notifications
        <i className="fa fa-angle-right fa-fw ms-2" />
      </ExtendedDropdownSection>
    </ExtendedDropdown>
  </UncontrolledDropdown>
)

export { NavbarActivityFeed }
