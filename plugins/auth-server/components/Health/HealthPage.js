import React, { useState, useEffect } from 'react'
import {
  Container,
  CardBody,
  Card,
  CardHeader,
} from '../../../../app/components'

function HealthPage() {
  useEffect(() => {}, [])
  return (
    <Container>
      <Card className="mb-3">
        <CardBody>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              Jans-auth server status
            </CardHeader>
            <CardBody>Running</CardBody>
          </Card>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              database status
            </CardHeader>
            <CardBody>Online</CardBody>
          </Card>
        </CardBody>
      </Card>
    </Container>
  )
}

export default HealthPage
