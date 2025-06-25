import React from 'react'
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
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  AvatarImage,
} from 'Components'
import { ExtendedDropdownSection } from '@/components/ExtendedDropdown/ExtendedDropdownSection'
import { ExtendedDropdownLink } from '@/components/ExtendedDropdown/ExtendedDropdownLink'

const messagesColors = ['text-success', 'text-danger', 'text-warning']

interface NavbarMessagesProps {
  className?: string
  style?: React.CSSProperties
}

const NavbarMessages: React.FC<NavbarMessagesProps> = (props) => (
  <UncontrolledDropdown nav inNavbar {...props}>
    <DropdownToggle nav>
      <IconWithBadge
        badge={
          <Badge pill color="white">
            1
          </Badge>
        }
      >
        <i className="fa fa-envelope-o fa-fw" style={{ color: 'white' }} />
      </IconWithBadge>
    </DropdownToggle>
    <ExtendedDropdown right>
      <ExtendedDropdownSection className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Messages</h6>
        <ExtendedDropdownLink to="/apps/new-email">
          <i className="fa fa-pencil" />
        </ExtendedDropdownLink>
      </ExtendedDropdownSection>
      <ExtendedDropdownSection>
        <InputGroup>
          <Input placeholder="Search Messages..." />
          <InputGroupAddon addonType="append">
            <Button color="secondary" outline>
              <i className="fa fa-search" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </ExtendedDropdownSection>
      <ExtendedDropdownSection list>
        <ListGroup>
          {_.times(1, (index) => (
            <ListGroupItem tag={ExtendedDropdownLink} to="/apps/email-details" key={index} action>
              <Media>
                <Media left>
                  <AvatarImage src="admin/static/logo.png" className="me-4" />
                </Media>
                <Media body>
                  <span className="d-flex justify-content-start">
                    <i
                      className={`fa fa-circle small ${messagesColors[index]} me-2 d-flex align-items-center`}
                    />
                    <span className="h6 pb-0 mb-0 d-flex align-items-center">
                      {'faker.name.firstName()'}
                    </span>

                    <span className="ms-1 small">(23)</span>
                    <span className="ms-auto small">Now</span>
                  </span>
                  <p className="mt-2 mb-1">{'faker.lorem.sentences()'}</p>
                </Media>
              </Media>
            </ListGroupItem>
          ))}
        </ListGroup>
      </ExtendedDropdownSection>
      <ExtendedDropdownSection className="text-center" tag={ExtendedDropdownLink} to="/apps/inbox">
        View All
        <i className="fa fa-angle-right fa-fw ms-2" />
      </ExtendedDropdownSection>
    </ExtendedDropdown>
  </UncontrolledDropdown>
)

export { NavbarMessages }
