import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Row, Col, CardFooter, Progress } from "shards-react";

const UserStats = ({ smallStats }) => (
  <Card small className="user-stats mb-4">
    <CardBody>
      <Row>
        {smallStats.map((stat, idx) => (
          <Col key={idx} lg="3" md="6" sm="3" className="text-center">
            <h4 className="m-0">{stat.value}</h4>
            <span className="text-light text-uppercase">{stat.title}</span>
          </Col>
        ))}
      </Row>
    </CardBody>
    <CardFooter className="py-0">
      <Row>
        {/* Progress :: Workload */}
        <Col sm="12" md="6" className="border-top pb-3 pt-2 border-right">
          <div className="progress-wrapper">
            <div className="progress-label">Workload</div>
            <Progress className="progress-sm" value="80" striped>
              <span className="progress-value">80%</span>
            </Progress>
          </div>
        </Col>
        {/* Progress :: Performance */}
        <Col sm="12" md="6" className="border-top pb-3 pt-2">
          <div className="progress-wrapper">
            <div className="progress-label">Performance</div>
            <Progress
              className="progress-sm"
              theme="success"
              value="92"
              striped
            >
              <span className="progress-value">92%</span>
            </Progress>
          </div>
        </Col>
      </Row>
    </CardFooter>
  </Card>
);

UserStats.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

UserStats.defaultProps = {
  smallStats: [
    {
      title: "Tasks",
      value: "1128"
    },
    {
      title: "Completed",
      value: "72.4%"
    },
    {
      title: "Projects",
      value: "4"
    },
    {
      title: "Teams",
      value: "3"
    }
  ]
};

export default UserStats;
