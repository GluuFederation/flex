import React from "react";
import { Container, Row, Col } from "./../../../components";
import GluuFormDetailRow from "../Gluu/GluuFormDetailRow";
function ScopeDetailPage({ row }) {
  function getBadgeTheme(status) {
    if (status) {
      return "primary";
    } else {
      return "info";
    }
  }
  return (
    <React.Fragment>
      {/* START Content */}
      <Container style={{ backgroundColor: "#F5F5F5" }}>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label="Inum" value={row.inum} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="Id" value={row.id} />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label="Description" value={row.description} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="Scope Type"
              value={row.scopeType}
              isBadge
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow
              label="Uma Type"
              isBadge
              badgeColor={getBadgeTheme(row.umaType)}
              value={row.umaType ? "Yes" : "No"}
            />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow
              label="Default Scope"
              isBadge
              badgeColor={getBadgeTheme(row.defaultScope)}
              value={row.defaultScope ? "Yes" : "No"}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>Attributes:</Col>
          <Col sm={6}>
            {Object.keys(row.attributes).map((key, i) => (
              <GluuFormDetailRow
                key={key}
                label={key}
                isBadge={row.attributes[key]}
                value={String(row.attributes[key])}
              />
            ))}
          </Col>
        </Row>
        {/* END Content */}
      </Container>
    </React.Fragment>
  );
}

export default ScopeDetailPage;
