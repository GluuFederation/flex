import React from "react";
import TagsInput from "react-tagsinput";
import {
  Alert,
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardFooter,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "shards-react";

import FormSectionTitle from "../components/edit-user-profile/FormSectionTitle";
import ProfileBackgroundPhoto from "../components/edit-user-profile/ProfileBackgroundPhoto";

class EditUserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [
        "User Experience",
        "UI Design",
        "React JS",
        "HTML & CSS",
        "JavaScript",
        "Bootstrap 4"
      ]
    };

    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleTagsChange(tags) {
    this.setState({ tags });
  }

  handleFormSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <Container fluid className="px-0">
          <Alert theme="success" className="mb-0">
            Ole! Your profile has been successfully updated!
          </Alert>
        </Container>
        <Container fluid className="main-content-container px-4">
          <Row>
            <Col lg="8" className="mx-auto mt-4">
              <Card small className="edit-user-details mb-4">
                <ProfileBackgroundPhoto />

                <CardBody className="p-0">
                  <div className="border-bottom clearfix d-flex">
                    <Nav tabs className="border-0 mt-auto mx-4 pt-2">
                      <NavItem>
                        <NavLink active>General</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink>Projects</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink>Collaboration</NavLink>
                      </NavItem>
                    </Nav>
                  </div>

                  {/* Form Section Title :: General */}
                  <Form className="py-4" onSubmit={this.handleFormSubmit}>
                    <FormSectionTitle
                      title="General"
                      description="Setup your general profile details."
                    />

                    <Row form className="mx-4">
                      <Col lg="8">
                        <Row form>
                          {/* First Name */}
                          <Col md="6" className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <FormInput
                              id="firstName"
                              value="Sierra"
                              onChange={() => {}}
                            />
                          </Col>

                          {/* Last Name */}
                          <Col md="6" className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <FormInput
                              type="text"
                              id="lastName"
                              value="Brooks"
                              onChange={() => {}}
                            />
                          </Col>

                          {/* Location */}
                          <Col md="6" className="form-group">
                            <label htmlFor="userLocation">Location</label>
                            <InputGroup seamless>
                              <InputGroupAddon type="prepend">
                                <InputGroupText>
                                  <i className="material-icons">&#xE0C8;</i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <FormInput
                                id="userLocation"
                                value="Remote"
                                onChange={() => {}}
                              />
                            </InputGroup>
                          </Col>

                          {/* Phone Number */}
                          <Col md="6" className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <InputGroup seamless>
                              <InputGroupAddon type="prepend">
                                <InputGroupText>
                                  <i className="material-icons">&#xE0CD;</i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <FormInput
                                id="phoneNumber"
                                value="+40 1234 567 890"
                                onChange={() => {}}
                              />
                            </InputGroup>
                          </Col>

                          {/* Email Address */}
                          <Col md="6" className="form-group">
                            <label htmlFor="emailAddress">Email</label>
                            <InputGroup seamless>
                              <InputGroupAddon type="prepend">
                                <InputGroupText>
                                  <i className="material-icons">&#xE0BE;</i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <FormInput
                                id="emailAddress"
                                onChange={() => {}}
                              />
                            </InputGroup>
                          </Col>

                          <Col md="6" className="form-group">
                            <label htmlFor="displayEmail">
                              Display Email Publicly
                            </label>
                            <FormSelect>
                              <option>Select an Option</option>
                              <option>Yes, display my email.</option>
                              <option>No, do not display my email.</option>
                            </FormSelect>
                          </Col>
                        </Row>
                      </Col>

                      {/* User Profile Picture */}
                      <Col lg="4">
                        <label
                          htmlFor="userProfilePicture"
                          className="text-center w-100 mb-4"
                        >
                          Profile Picture
                        </label>
                        <div className="edit-user-details__avatar m-auto">
                          <img
                            src={require("../images/avatars/0.jpg")}
                            alt="User Avatar"
                          />
                          <label className="edit-user-details__avatar__change">
                            <i className="material-icons mr-1">&#xE439;</i>
                            <FormInput
                              id="userProfilePicture"
                              className="d-none"
                            />
                          </label>
                        </div>
                        <Button
                          size="sm"
                          theme="white"
                          className="d-table mx-auto mt-4"
                        >
                          <i className="material-icons">&#xE2C3;</i> Upload
                          Image
                        </Button>
                      </Col>
                    </Row>

                    <Row form className="mx-4">
                      {/* User Bio */}
                      <Col md="6" className="form-group">
                        <label htmlFor="userBio">Bio</label>
                        <FormTextarea
                          style={{ minHeight: "87px" }}
                          id="userBio"
                          value="I'm a design focused engineer."
                          onChange={() => {}}
                        />
                      </Col>

                      {/* User Tags */}
                      <Col md="6" className="form-group">
                        <label htmlFor="userTags">Tags</label>
                        <TagsInput
                          value={this.state.tags}
                          onChange={this.handleTagsChange}
                        />
                      </Col>
                    </Row>

                    <hr />

                    {/* Form Section Title :: Social Profiles */}
                    <FormSectionTitle
                      title="Social"
                      description="Setup your social profiles info."
                    />

                    <Row form className="mx-4">
                      {/* Facebook */}
                      <Col md="4" className="form-group">
                        <label htmlFor="socialFacebook">Facebook</label>
                        <InputGroup seamless>
                          <InputGroupAddon type="prepend">
                            <InputGroupText>
                              <i className="fab fa-facebook-f" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <FormInput id="socialFacebook" onChange={() => {}} />
                        </InputGroup>
                      </Col>

                      {/* Twitter */}
                      <Col md="4" className="form-group">
                        <label htmlFor="socialTwitter">Twitter</label>
                        <InputGroup seamless>
                          <InputGroupAddon type="prepend">
                            <InputGroupText>
                              <i className="fab fa-twitter" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <FormInput id="socialTwitter" onChange={() => {}} />
                        </InputGroup>
                      </Col>

                      {/* GitHub */}
                      <Col md="4" className="form-group">
                        <label htmlFor="socialGitHub">GitHub</label>
                        <InputGroup seamless>
                          <InputGroupAddon type="prepend">
                            <InputGroupText>
                              <i className="fab fa-github" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <FormInput id="socialGitHub" onChange={() => {}} />
                        </InputGroup>
                      </Col>

                      {/* Slack */}
                      <Col md="4" className="form-group">
                        <label htmlFor="socialSlack">Slack</label>
                        <InputGroup seamless>
                          <InputGroupAddon type="prepend">
                            <InputGroupText>
                              <i className="fab fa-slack" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <FormInput id="socialSlack" onChange={() => {}} />
                        </InputGroup>
                      </Col>

                      {/* Dribbble */}
                      <Col md="4" className="form-group">
                        <label htmlFor="socialDribbble">Dribbble</label>
                        <InputGroup seamless>
                          <InputGroupAddon type="prepend">
                            <InputGroupText>
                              <i className="fab fa-dribbble" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <FormInput id="socialDribbble" onChange={() => {}} />
                        </InputGroup>
                      </Col>

                      {/* Google Plus */}
                      <Col md="4" className="form-group">
                        <label htmlFor="socialGooglePlus">Google Plus</label>
                        <InputGroup seamless>
                          <InputGroupAddon type="prepend">
                            <InputGroupText>
                              <i className="fab fa-google-plus-g" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <FormInput
                            id="socialGooglePlus"
                            onChange={() => {}}
                          />
                        </InputGroup>
                      </Col>
                    </Row>

                    <hr />

                    {/* Form Section Title :: Notifications */}
                    <FormSectionTitle
                      title="Notifications"
                      description="Setup which notifications would you like to receive."
                    />

                    {/* Notifications :: Conversations */}
                    <Row form className="mx-4">
                      <Col
                        tag="label"
                        htmlFor="conversationsEmailsToggle"
                        className="col-form-label"
                      >
                        Conversations
                        <small className="text-muted form-text">
                          Sends notification emails with updates for the
                          conversations you are participating in or if someone
                          mentions you.
                        </small>
                      </Col>
                      <Col className="d-flex">
                        <FormCheckbox
                          toggle
                          checked
                          className="ml-auto my-auto"
                          id="conversationsEmailsToggle"
                          onChange={() => {}}
                        />
                      </Col>
                    </Row>

                    {/* Notifications :: New Projects */}
                    <Row form className="mx-4">
                      <Col
                        tag="label"
                        htmlFor="newProjectsEmailsToggle"
                        className="col-form-label"
                      >
                        New Projects
                        <small className="text-muted form-text">
                          Sends notification emails when you are invited to a
                          new project.
                        </small>
                      </Col>
                      <Col className="d-flex">
                        <FormCheckbox
                          toggle
                          className="ml-auto my-auto"
                          id="newProjectsEmailsToggle"
                          onChange={() => {}}
                        />
                      </Col>
                    </Row>

                    {/* Notifications :: Vulnerabilities */}
                    <Row form className="mx-4">
                      <Col
                        tag="label"
                        htmlFor="conversationsEmailsToggle"
                        className="col-form-label"
                      >
                        Vulnerability Alerts
                        <small className="text-muted form-text">
                          Sends notification emails when everything goes down
                          and there's no hope left whatsoever.
                        </small>
                      </Col>
                      <Col className="d-flex">
                        <FormCheckbox
                          toggle
                          checked
                          className="ml-auto my-auto"
                          id="conversationsEmailsToggle"
                          onChange={() => {}}
                        />
                      </Col>
                    </Row>

                    <hr />

                    {/* Change Password */}
                    <Row form className="mx-4">
                      <Col className="mb-3">
                        <h6 className="form-text m-0">Change Password</h6>
                        <p className="form-text text-muted m-0">
                          Change your current password.
                        </p>
                      </Col>
                    </Row>

                    <Row form className="mx-4">
                      {/* Change Password :: Old Password */}
                      <Col md="4" className="form-group">
                        <label htmlFor="oldPassword">Old Password</label>
                        <FormInput
                          id="oldPassword"
                          placeholder="Old Password"
                          onChange={() => {}}
                        />
                      </Col>

                      {/* Change Password :: New Password */}
                      <Col md="4" className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <FormInput
                          id="newPassword"
                          placeholder="New Password"
                          onChange={() => {}}
                        />
                      </Col>

                      {/* Change Password :: Repeat New Password */}
                      <Col md="4" className="form-group">
                        <label htmlFor="repeatNewPassword">
                          Repeat New Password
                        </label>
                        <FormInput
                          id="repeatNewPassword"
                          placeholder="Old Password"
                          onChange={() => {}}
                        />
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter className="border-top">
                  <Button
                    size="sm"
                    theme="accent"
                    className="ml-auto d-table mr-3"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default EditUserProfile;
