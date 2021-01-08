import React from "react";
import { Container, CardBody, Card } from "./../../../components";
import ClientForm from "./ClientForm";
function ClientAddPage() {
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <ClientForm />
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  );
}

export default ClientAddPage;
