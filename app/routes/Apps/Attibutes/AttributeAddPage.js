import React from "react";

import { Container, CardBody, Card } from "./../../../components";
import AttributeForm from "./AttributeForm";
export default function AttributeAddPage() {
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <AttributeForm />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}
