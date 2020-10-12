import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, ButtonGroup, Button } from "shards-react";
import { NavLink } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";
import SmallStats from "../components/common/SmallStats";
import CountryReports from "../components/common/CountryReports";
import SalesReport from "../components/ecommerce/SalesReport";
import SalesByCategory from "../components/ecommerce/SalesByCategory";
import LatestOrders from "../components/ecommerce/LatestOrders";

import colors from "../utils/colors";

const OnlineStore = ({ smallStats }) => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Sales Overview" subtitle="Dashboards" className="text-sm-left mb-3" />

      {/* Page Header :: Actions */}
      <Col sm="4" className="col d-flex align-items-center">
        <ButtonGroup size="sm" className="d-inline-flex mb-3 mb-sm-0 mx-auto">
          <Button theme="white" tag={NavLink} to="/analytics">
            Traffic
          </Button>
          <Button theme="white" tag={NavLink} to="/ecommerce">
            Sales
          </Button>
        </ButtonGroup>
      </Col>

      {/* Page Header :: Datepicker */}
      <Col sm="4" className="d-flex">
        <RangeDatePicker className="justify-content-end" />
      </Col>
    </Row>

    {/* Small Stats Blocks */}
    <Row>
      {smallStats.map((stats, idx) => (
        <Col key={idx} md="6" lg="3" className="mb-4">
          <SmallStats
            id={`small-stats-${idx}`}
            chartData={stats.datasets}
            chartLabels={stats.chartLabels}
            label={stats.label}
            value={stats.value}
            percentage={stats.percentage}
            increase={stats.increase}
            decrease={stats.decrease}
          />
        </Col>
      ))}
    </Row>

    <Row>
      {/* Sales Report */}
      <Col lg="8" md="12" sm="12" className="mb-4">
        <SalesReport />
      </Col>

      {/* Sales by Categories */}
      <Col lg="4" md="6" sm="6" className="mb-4">
        <SalesByCategory />
      </Col>
    </Row>

    <Row>
      {/* Country Reports */}
      <Col lg="4" className="mb-4">
        <CountryReports title="Sales by country" />
      </Col>

      {/* Latest Orders */}
      <Col lg="8" className="mb-4">
        <LatestOrders />
      </Col>
    </Row>
  </Container>
);

OnlineStore.propTypes = {
  /**
   * The data for the small stats.
   */
  smallStats: PropTypes.array
};

OnlineStore.defaultProps = {
  smallStats: [
    {
      label: "Total Revenue",
      value: "$29,219",
      percentage: "2.93%",
      chartLabels: [null, null, null, null, null],
      increase: true,
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.primary.toRGBA(0.1),
          borderColor: colors.primary.toRGBA(),
          data: [4, 4, 4, 9, 20]
        }
      ]
    },
    {
      label: "Revenue Today",
      value: "$8,391",
      percentage: "7.21%",
      chartLabels: [null, null, null, null, null],
      increase: false,
      decrease: true,
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.success.toRGBA(0.1),
          borderColor: colors.success.toRGBA(),
          data: [1, 9, 1, 9, 9]
        }
      ]
    },
    {
      label: "Total Customers",
      value: "981",
      percentage: "3.71%",
      chartLabels: [null, null, null, null, null],
      increase: true,
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.warning.toRGBA(0.1),
          borderColor: colors.warning.toRGBA(),
          data: [9, 9, 3, 9, 9]
        }
      ]
    },
    {
      label: "New Customers",
      value: "29",
      percentage: "2.71%",
      chartLabels: [null, null, null, null, null],
      increase: false,
      decrease: true,
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.salmon.toRGBA(0.1),
          borderColor: colors.salmon.toRGBA(),
          data: [3, 3, 4, 9, 4]
        }
      ]
    }
  ]
};

export default OnlineStore;
