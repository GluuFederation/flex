import React from 'react'
import ScopeForm from './ScopeForm'
import { Container, CardBody, Card } from './../../../components'
function ScopeAddPage() {
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <ScopeForm></ScopeForm>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default ScopeAddPage
