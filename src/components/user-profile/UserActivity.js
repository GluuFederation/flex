/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Button
} from "shards-react";

const UserActivity = ({ title }) => (
  <Card small className="user-activity mb-4">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
      <div className="block-handle" />
    </CardHeader>
    <CardBody className="p-0">
      {/* User Activity Icon */}
      <div className="user-activity__item pr-3 py-3">
        <div className="user-activity__item__icon">
          <i className="material-icons">&#xE7FE;</i>
        </div>
        <div className="user-activity__item__content">
          <span className="text-light">23 Minutes ago</span>
          <p>
            Assigned himself to the <a href="#">Shards Dashboards</a> project.
          </p>
        </div>
        <div className="user-activity__item__action ml-auto">
          <button className="ml-auto btn btn-sm btn-white">View Project</button>
        </div>
      </div>
      {/* User Activity Icon */}
      <div className="user-activity__item pr-3 py-3">
        <div className="user-activity__item__icon">
          <i className="material-icons">&#xE5CA;</i>
        </div>
        <div className="user-activity__item__content">
          <span className="text-light">2 Hours ago</span>
          <p>
            Marked <a href="#">7 tasks</a> as{" "}
            <Badge outline pill theme="success">
              Complete
            </Badge>{" "}
            inside the <a href="#">DesignRevision</a> project.
          </p>
        </div>
      </div>
      {/* User Activity Icon */}
      <div className="user-activity__item pr-3 py-3">
        <div className="user-activity__item__icon">
          <i className="material-icons">&#xE7FE;</i>
        </div>
        <div className="user-activity__item__content">
          <span className="text-light">3 Hours and 10 minutes ago</span>
          <p>
            Added <a href="#">Jack Nicholson</a> and <a href="#">3 others</a> to
            the <a href="#">DesignRevision</a> team.
          </p>
        </div>
        <div className="user-activity__item__action ml-auto">
          <button className="ml-auto btn btn-sm btn-white">View Team</button>
        </div>
      </div>
      {/* User Activity Icon */}
      <div className="user-activity__item pr-3 py-3">
        <div className="user-activity__item__icon">
          <i className="material-icons">&#xE868;</i>
        </div>
        <div className="user-activity__item__content">
          <span className="text-light">2 Days ago</span>
          <p>
            Opened <a href="#">3 issues</a> in <a href="#">2 projects</a>.
          </p>
        </div>
      </div>
      {/* User Activity Icon */}
      <div className="user-activity__item pr-3 py-3">
        <div className="user-activity__item__icon">
          <i className="material-icons">&#xE065;</i>
        </div>
        <div className="user-activity__item__content">
          <span className="text-light">2 Days ago</span>
          <p>
            Added <a href="#">3 new tasks</a> to the{" "}
            <a href="#">DesignRevision</a> project:
          </p>
          <ul className="user-activity__item__task-list mt-2">
            <li>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="user-activity-task-1"
                />
                <label
                  className="custom-control-label"
                  htmlFor="user-activity-task-1"
                >
                  Fix blog pagination issue.
                </label>
              </div>
            </li>
            <li>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="user-activity-task-2"
                />
                <label
                  className="custom-control-label"
                  htmlFor="user-activity-task-2"
                >
                  Remove extra padding from blog post container.
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* User Activity Icon */}
      <div className="user-activity__item pr-3 py-3">
        <div className="user-activity__item__icon">
          <i className="material-icons">&#xE5CD;</i>
        </div>
        <div className="user-activity__item__content">
          <span className="text-light">2 Days ago</span>
          <p>
            Marked <a href="#">3 tasks</a> as{" "}
            <Badge outline pill theme="danger">
              Invalid
            </Badge>{" "}
            inside the <a href="#">Shards Dashboards</a> project.
          </p>
        </div>
      </div>
    </CardBody>
    <CardFooter className="border-top">
      <Button size="sm" theme="white" className="d-table mx-auto">
        Load More
      </Button>
    </CardFooter>
  </Card>
);

UserActivity.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

UserActivity.defaultProps = {
  title: "User Activity"
};

export default UserActivity;
