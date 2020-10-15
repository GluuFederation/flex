import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, ButtonGroup } from "shards-react";
import { NavLink } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import RangeDatePicker from "../components/common/RangeDatePicker";

import colors from "../utils/colors";

const HeaderNavigation = ({ smallStats }) => (
  <Container className="main-content-container px-4">

    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Analytics" subtitle="Overview" className="text-sm-left mb-3" />

      {/* Page Header :: Actions */}
      <Col sm="4" className="col d-flex align-items-center">
        <ButtonGroup size="sm" className="d-inline-flex mb-3 mb-sm-0 mx-auto">
          <Button theme="white" tag={NavLink} to="/analytics">Traffic</Button>
          <Button theme="white" tag={NavLink} to="/ecommerce">Sales</Button>
        </ButtonGroup>
      </Col>

      {/* Page Header :: Datepicker */}
      <Col sm="4" className="d-flex">
        <RangeDatePicker className="justify-content-end" />
      </Col>
    </Row>
  </Container>
)

HeaderNavigation.propTypes = {
  /**
   * The small stats data.
   */
  smallStats: PropTypes.array
};

HeaderNavigation.defaultProps = {
  smallStats: [{
    label: 'Users',
    value: '2,390',
    percentage: '12.4%',
    increase: true,
    decrease: false,
    chartLabels: [null, null, null, null, null],
    datasets: [{
      label: 'Today',
      fill: 'start',
      borderWidth: 1.5,
      backgroundColor: colors.primary.toRGBA(0.1),
      borderColor: colors.primary.toRGBA(),
      data: [9, 3, 3, 9, 9],
    }],
  }, {
    label: 'Sessions',
    value: '8,391',
    percentage: '7.21%',
    increase: false,
    decrease: true,
    chartLabels: [null, null, null, null, null],
    datasets: [{
      label: 'Today',
      fill: 'start',
      borderWidth: 1.5,
      backgroundColor: colors.success.toRGBA(0.1),
      borderColor: colors.success.toRGBA(),
      data: [3.9, 4, 4, 9, 4],
    }],
  }, {
    label: 'Pageviews',
    value: '21,293',
    percentage: '3.71%',
    increase: true,
    decrease: false,
    chartLabels: [null, null, null, null, null],
    datasets: [{
      label: 'Today',
      fill: 'start',
      borderWidth: 1.5,
      backgroundColor: colors.warning.toRGBA(0.1),
      borderColor: colors.warning.toRGBA(),
      data: [6, 6, 9, 3, 3],
    }],
  }, {
    label: 'Pages/Session',
    value: '6.43',
    percentage: '2.71%',
    increase: false,
    decrease: true,
    chartLabels: [null, null, null, null, null],
    datasets: [{
      label: 'Today',
      fill: 'start',
      borderWidth: 1.5,
      backgroundColor: colors.salmon.toRGBA(0.1),
      borderColor: colors.salmon.toRGBA(),
      data: [0, 9, 3, 3, 3],
    }],
  }]
};

export default HeaderNavigation;
