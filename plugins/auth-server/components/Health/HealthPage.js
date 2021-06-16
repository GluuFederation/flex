import React, { useState, useEffect } from 'react'
import {
  Container,
  CardBody,
  Card,
  CardHeader,
} from '../../../../app/components'
import { useTranslation } from 'react-i18next'

function HealthPage() {
  const { t } = useTranslation()
  useEffect(() => {}, [])
  return (
    <Container>
      <Card className="mb-3">
        <CardBody>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              {t("Jans-auth server status")}
            </CardHeader>
            <CardBody>{t("Running")}</CardBody>
          </Card>
          <Card className="mb-3">
            <CardHeader tag="h6" className="bg-success text-white">
              {t("database status")}
            </CardHeader>
            <CardBody>{t("Online")}</CardBody>
          </Card>
        </CardBody>
      </Card>
    </Container>
  )
}

export default HealthPage
