import React from 'react'
import StaticConfiguration from './StaticConfiguration';
import DynamicConfiguration from './DynamicConfiguration';
import GluuTabs from '../../../../app/routes/Apps/Gluu/GluuTabs';
import { useTranslation } from 'react-i18next'
import { Container, Card, CardBody } from '../../../../app/components'
import SetTitle from 'Utils/SetTitle'

const tabNames = [
  "Static Configuration",
  "Dynamic Configuration"
];

export default function Fido() {
  const { t } = useTranslation()
  SetTitle(t('titles.fido_management'))

  const tabToShow = (tabName) => {
    switch (tabName) {
      case "Static Configuration":
        return <StaticConfiguration handleSubmit={handleSubmit}/>;
      case "Dynamic Configuration":
        return <DynamicConfiguration handleSubmit={handleSubmit}/>;
    }
  };

  const handleSubmit = (value) => {

  }
  return (
    <React.Fragment>
      <Container>
        <Card className="mb-3">
          <CardBody>
            <GluuTabs tabNames={tabNames} tabToShow={tabToShow} handleSubmit={handleSubmit}/>
          </CardBody>
        </Card>
      </Container>
    </React.Fragment>
  )
}
