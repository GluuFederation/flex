import React from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  FormSelect,
  ButtonGroup,
  Button
} from "shards-react";

const LatestOrders = ({ title, latestOrdersData }) => (
  <Card small className="lo-stats h-100">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
      <div className="block-handle" />
    </CardHeader>

    <CardBody className="p-0">
      <Container fluid className="px-0">
        <table className="table mb-0">
          <thead className="py-2 bg-light text-semibold border-bottom">
            <tr>
              <th>Details</th>
              <th />
              <th className="text-center">Status</th>
              <th className="text-center">Items</th>
              <th className="text-center">Total</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {latestOrdersData.map((item, idx) => (
              <tr key={idx}>
                <td className="lo-stats__image">
                  <img
                    alt={item.title}
                    className="border rounded"
                    src={item.image}
                  />
                </td>
                <td className="lo-stats__order-details">
                  <span>{item.id}</span>
                  <span>{item.date}</span>
                </td>
                <td className="lo-stats__status">
                  <div className="d-table mx-auto">
                    <Badge pill theme={getBadgeType(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </td>
                <td className="lo-stats__items text-center">{item.items}</td>
                <td className="lo-stats__total text-center text-success">
                  {item.total}
                </td>
                <td className="lo-stats__actions">
                  <ButtonGroup className="d-table ml-auto">
                    <Button size="sm" theme="white">
                      Cancel
                    </Button>
                    <Button size="sm" theme="white">
                      Edit
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </CardBody>

    <CardFooter className="border-top">
      <Row>
        {/* Time Span */}
        <Col>
          <FormSelect
            size="sm"
            value="last-week"
            style={{ maxWidth: "130px" }}
            onChange={() => {}}
          >
            <option value="last-week">Last Week</option>
            <option value="today">Today</option>
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
          </FormSelect>
        </Col>

        {/* View Full Report */}
        <Col className="text-right view-report">
          {/* eslint-disable-next-line */}
          <a href="#">View full report &rarr;</a>
        </Col>
      </Row>
    </CardFooter>
  </Card>
);

/**
 * Returns the badge type for a specific
 */
function getBadgeType(itemStatus) {
  const statusMap = {
    Complete: "success",
    Pending: "warning",
    Canceled: "danger"
  };

  return statusMap[itemStatus];
}

LatestOrders.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,

  /**
   * The latest orders data.
   */
  latestOrdersData: PropTypes.array
};

LatestOrders.defaultProps = {
  title: "Latest Orders",
  latestOrdersData: [
    {
      id: "#19280",
      date: "21 February 2018 20:32",
      image: require("../../images/sales-overview/product-sweaters.jpg"),
      status: "Complete",
      items: "7",
      total: "$199"
    },
    {
      id: "#19279",
      date: "21 February 2018 20:32",
      image: require("../../images/sales-overview/product-order-1.jpg"),
      status: "Pending",
      items: "7",
      total: "$612"
    },
    {
      id: "#19278",
      date: "21 February 2018 20:32",
      image: require("../../images/sales-overview/product-order-2.jpg"),
      status: "Canceled",
      items: "18",
      total: "$1211"
    },
    {
      id: "#19277",
      date: "21 February 2018 20:32",
      image: require("../../images/sales-overview/product-order-3.jpg"),
      status: "Pending",
      items: "7",
      total: "$612"
    }
  ]
};

export default LatestOrders;
