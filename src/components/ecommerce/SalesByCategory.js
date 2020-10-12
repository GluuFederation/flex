import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormSelect
} from "shards-react";

const SalesByCategory = ({ title, categories }) => (
  <Card small className="sc-stats h-100">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
      <div className="block-handle" />
    </CardHeader>

    <CardBody className="p-0">
      <Container fluid>
        {categories.map((item, idx) => (
          <Row key={idx} className="px-3">
            <Col className="sc-stats__image">
              <img
                alt={item.title}
                className="border rounded"
                src={item.image}
              />
            </Col>
            <Col className="sc-stats__title">{item.title}</Col>
            <Col className="sc-stats__value text-right">{item.value}</Col>
            <Col className="sc-stats__percentage text-right">
              {item.percentage}
            </Col>
          </Row>
        ))}
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

SalesByCategory.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The categories data.
   */
  categories: PropTypes.array
};

SalesByCategory.defaultProps = {
  title: "Sales by Category",
  categories: [
    {
      image: require("../../images/sales-overview/product-shoes.jpg"),
      title: "Shoes",
      value: "12,281",
      percentage: "32.4%"
    },
    {
      image: require("../../images/sales-overview/no-product-image.jpg"),
      title: "Men's Jeans",
      value: "8,129",
      percentage: "28.4%"
    },
    {
      image: require("../../images/sales-overview/product-sportswear.jpg"),
      title: "Sportswear",
      value: "812",
      percentage: "12.2%"
    },
    {
      image: require("../../images/sales-overview/product-basics.jpg"),
      title: "Basics",
      value: "29",
      percentage: "7.1%"
    },
    {
      image: require("../../images/sales-overview/product-basics.jpg"),
      title: "Sweaters",
      value: "3",
      percentage: "1.2%"
    }
  ]
};

export default SalesByCategory;
