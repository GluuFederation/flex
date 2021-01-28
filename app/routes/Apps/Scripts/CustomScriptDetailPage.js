import React from "react";
import {
  Container,
  Badge,
  Row,
  Col,
  FormGroup,
  Label
} from "./../../../components";
import GluuFormDetailRow from "../Gluu/GluuFormDetailRow";

const CustomScriptDetailPage = ({ row }) => {
  
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
            <GluuFormDetailRow label="Name" value={row.name} />
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <GluuFormDetailRow label="Description" value={row.description} />
          </Col>
          <Col sm={6}>
            <GluuFormDetailRow label="LocationType" value={row.locationType} />
          </Col>
        </Row>
        <Row>
        <Col sm={6}>
        <GluuFormDetailRow
        label="Internal"
        isBadge
        badgeColor={getBadgeTheme(row.internal)}
        value={row.internal ? "true" : "false"}
      />
        </Col>
        <Col sm={6}>
        <GluuFormDetailRow
        label="Enabled"
        isBadge
        badgeColor={getBadgeTheme(row.enabled)}
        value={row.enabled ? "true" : "false"}
      />
        </Col>
      </Row>
      
       <Row>
        <Col sm={6}>
        <GluuFormDetailRow label="Script Type" value={row.scriptType} />
        </Col>
        <Col sm={6}>
        <GluuFormDetailRow label="Programming Language" value={row.programmingLanguage} />
        </Col>
        </Row>
        
        
        <Row>
        <Col sm={6}>Script:</Col>
        <Col sm={6}>
         <GluuFormDetailRow label="Script" value={row.script} />         
         </Col>
         </Row>
         
         <Row>
         <Col sm={6}>
           <GluuFormDetailRow label="Level" value={row.level} />
         </Col>
         <Col sm={6}>
           <GluuFormDetailRow label="revision" value={row.revision} />
         </Col>
       </Row>
       
       

        {/* END Content */}
      </Container>
    </React.Fragment>

  );
};
export default CustomScriptDetailPage;
