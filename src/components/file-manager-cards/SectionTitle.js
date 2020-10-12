import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "shards-react";

const SectionTitle = ({ title }) => (
  <Row>
    <Col>
      <span className="file-manager__group-title text-uppercase text-light">
        {title}
      </span>
    </Col>
  </Row>
);

SectionTitle.propTypes = {
  /**
   * The section's title.
   */
  title: PropTypes.string
};

SectionTitle.defaultProps = {
  title: "Section Title"
};

export default SectionTitle;
