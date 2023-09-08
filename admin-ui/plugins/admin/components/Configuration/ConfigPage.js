import React from 'react'
import { Card, CardBody } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useSelector } from 'react-redux'

function ConfigPage() {
  const loading = useSelector((state) => state.testReducer.loading)
  return (
    <GluuLoader blocking={loading}>
      <Card>
        <CardBody style={{ minHeight: 500 }}></CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ConfigPage
