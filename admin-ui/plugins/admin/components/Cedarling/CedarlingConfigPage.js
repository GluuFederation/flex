import { lazy, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  CustomInput,
  Col,
} from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuToogleRow from '@/routes/Apps/Gluu/GluuToogleRow'
import GluuLabel from '@/routes/Apps/Gluu/GluuLabel'

function CedarlingConfigPage() {
  const { t } = useTranslation()
  SetTitle(t('titles.cedarling_config'))
  const [adminUiPolicyStore, setAdminUiPolicyStore] = useState('')
  const [configApiPolicyStore, setConfigApiPolicyStore] = useState('')
  const [localPolicies, setLocalPolicies] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    const config = {
      adminUiPolicyStore,
      configApiPolicyStore,
      localPolicies,
    }
    console.log('Submitted Config:', config)
    alert('Configuration applied successfully!')
  }

  return (
    <Card className="shadow-sm align-items-center">
      <Col sm="9">
        <CardBody>
          <CardTitle tag="h4" className="text-center fw-bold mb-4">
            {t('documentation.cedarlingConfig.title')}
          </CardTitle>

          <Card className="bg-light border-0 p-3 mb-4">
            <CardText className="text-center text-secondary">
              {t('documentation.cedarlingConfig.point1')}{' '}
              <a
                href="https://github.com/kdhttps/admin-ui-cedarling-config"
                target="_blank"
                rel="noopener noreferrer"
              >
                AdminUICedarling
              </a>
              .
              <br />
              {t('documentation.cedarlingConfig.point2')}
            </CardText>
            <CardText className="text-center text-muted small">
              {t('documentation.cedarlingConfig.note')}{' '}
              <a href="https://cloud.gluu.org/agama-lab" target="_blank" rel="noopener noreferrer">
                Agama-Lab
              </a>
              .
            </CardText>
          </Card>

          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <GluuLabel label={'fields.adminUiPolicyStore'} />
              <Col sm={9}>
                <Input
                  id="adminUiPolicyStore"
                  type="text"
                  name="adminUiPolicyStore"
                  value={adminUiPolicyStore}
                  onChange={(e) => setAdminUiPolicyStore(e.target.value)}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <GluuLabel label={'fields.configApiPolicyStore'} />
              <Col sm={9}>
                <Input
                  id="configApiPolicyStore"
                  type="text"
                  name="configApiPolicyStore"
                  value={configApiPolicyStore}
                  onChange={(e) => setConfigApiPolicyStore(e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col sm={12} className="ps-4">
                <GluuToogleRow
                  name="localPolicies"
                  handler={(e) => {
                    setLocalPolicies(e.target.checked)
                  }}
                  lsize={4}
                  rsize={8}
                  label={`${t('fields.localPolicies')}`}
                  value={localPolicies}
                />
                <p className="text-muted small mt-2">
                  {t('documentation.cedarlingConfig.localPoliciesNote')}
                </p>
              </Col>
            </FormGroup>

            <div className="text-center mt-4">
              <Button color="dark" size="lg" type="submit">
                {t('actions.apply')}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Col>
    </Card>
  )
}

export default CedarlingConfigPage
