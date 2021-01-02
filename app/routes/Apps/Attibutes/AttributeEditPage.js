import React from "react";

import { Container, CardBody, Card } from "./../../../components";
import AttributeForm from "./AttributeForm";

export default function AttributeEditPage(props) {
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <AttributeForm data={props.match.params.gid.substring(1, 100)} />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
