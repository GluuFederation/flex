import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody, Row, Col, Badge } from "shards-react";

const UserDetails = ({ userData }) => (
  <Card small className="user-details mb-4">
    <CardHeader className="p-0">
      <div className="user-details__bg">
        <img src={userData.coverImg} alt={userData.name} />
      </div>
    </CardHeader>
    <CardBody className="p-0">
      {/* User Avatar */}
      <div className="user-details__avatar mx-auto">
        <img src={userData.avatarImg} alt={userData.name} />
      </div>
      {/* User Name */}
      <h4 className="text-center m-0 mt-2">{userData.name}</h4>
      {/* User Bio */}
      <p className="text-center text-light m-0 mb-2">{userData.bio}</p>
      {/* User Social Icons */}
      <ul className="user-details__social user-details__social--primary d-table mx-auto mb-4">
        {userData.social.facebook && (
          <li className="mx-1">
            <a href={userData.social.facebook}>
              <i className="fab fa-facebook-f" />
            </a>
          </li>
        )}
        {userData.social.twitter && (
          <li className="mx-1">
            <a href={userData.social.twitter}>
              <i className="fab fa-twitter" />
            </a>
          </li>
        )}
        {userData.social.github && (
          <li className="mx-1">
            <a href={userData.social.github}>
              <i className="fab fa-github" />
            </a>
          </li>
        )}
        {userData.social.slack && (
          <li className="mx-1">
            <a href={userData.social.slack}>
              <i className="fab fa-slack" />
            </a>
          </li>
        )}
      </ul>
      {/* User Data */}
      <div className="user-details__user-data border-top border-bottom p-4">
        <Row className="mb-3">
          <Col className="w-50">
            <span>Email</span>
            <span>{userData.email}</span>
          </Col>
          <Col className="w-50">
            <span>Location</span>
            <span>{userData.location}</span>
          </Col>
        </Row>
        <Row>
          <Col className="w-50">
            <span>Phone</span>
            <span>{userData.phone}</span>
          </Col>
          <Col className="w-50">
            <span>Account Number</span>
            <span>{userData.accNumber}</span>
          </Col>
        </Row>
      </div>
      {/* User Tags */}
      <div className="user-details__tags p-4">
        {userData.tags.map((tag, idx) => (
          <Badge
            pill
            theme="light"
            className="text-light text-uppercase mb-2 border mr-1"
            key={idx}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </CardBody>
  </Card>
);

UserDetails.propTypes = {
  /**
   * The user data.
   */
  userData: PropTypes.object
};

UserDetails.defaultProps = {
  userData: {
    coverImg: require("../../images/user-profile/up-user-details-background.jpg"),
    avatarImg: require("../../images/avatars/0.jpg"),
    name: "Sierra Brooks",
    bio: "I'm a design focused engineer.",
    email: "sierra@example.com",
    location: "Remote",
    phone: "+40 1234 567 890",
    accNumber: "123456789",
    social: {
      facebook: "#",
      twitter: "#",
      github: "#",
      slack: "#"
    },
    tags: [
      "User Experience",
      "UI Design",
      "React JS",
      "HTML & CSS",
      "JavaScript",
      "Bootstrap 4"
    ]
  }
};

export default UserDetails;
