import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, ButtonGroup } from "shards-react";
import { NavLink } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";
import SmallStats from "../components/common/SmallStats";
import TopReferrals from "../components/common/TopReferrals";
import CountryReports from "../components/common/CountryReports";
import Sessions from "../components/analytics/Sessions";
import UsersByDevice from "../components/analytics/UsersByDevice";
import GoalsOverview from "../components/analytics/GoalsOverview/GoalsOverview";

import colors from "../utils/colors";

const IconSidebar = ({ smallStats }) => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Analytics" subtitle="Overview" className="text-sm-left mb-3" />

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
      {/* Sessions */}
      <Col lg="8" md="12" sm="12" className="mb-4">
        <Sessions />
      </Col>

      {/* Users by Device */}
      <Col lg="4" md="6" sm="6" className="mb-4">
        <UsersByDevice />
      </Col>

      {/* Top Referrals */}
      <Col lg="3" sm="6" className="mb-4">
        <TopReferrals />
      </Col>

      {/* Goals Overview */}
      <Col lg="5" className="mb-4">
        <GoalsOverview />
      </Col>

      {/* Country Reports */}
      <Col lg="4" className="mb-4">
        <CountryReports />
      </Col>
    </Row>
  </Container>
);

IconSidebar.propTypes = {
  /**
   * The small stats data.
   */
  smallStats: PropTypes.array
};

IconSidebar.defaultProps = {
  smallStats: [
    {
      label: "Users",
      value: "2,390",
      percentage: "12.4%",
      increase: true,
      decrease: false,
      chartLabels: [null, null, null, null, null],
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.primary.toRGBA(0.1),
          borderColor: colors.primary.toRGBA(),
          data: [9, 3, 3, 9, 9]
        }
      ]
    },
    {
      label: "Sessions",
      value: "8,391",
      percentage: "7.21%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null],
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.success.toRGBA(0.1),
          borderColor: colors.success.toRGBA(),
          data: [3.9, 4, 4, 9, 4]
        }
      ]
    },
    {
      label: "Pageviews",
      value: "21,293",
      percentage: "3.71%",
      increase: true,
      decrease: false,
      chartLabels: [null, null, null, null, null],
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.warning.toRGBA(0.1),
          borderColor: colors.warning.toRGBA(),
          data: [6, 6, 9, 3, 3]
        }
      ]
    },
    {
      label: "Pages/Session",
      value: "6.43",
      percentage: "2.71%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null],
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: colors.salmon.toRGBA(0.1),
          borderColor: colors.salmon.toRGBA(),
          data: [0, 9, 3, 3, 3]
        }
      ]
    }
  ]
};

export default IconSidebar;
