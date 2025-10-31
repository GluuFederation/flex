import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  CardTitle,
  CardText,
  Form,
  Input,
  Col,
} from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuLabel from '@/routes/Apps/Gluu/GluuLabel'
import { useDispatch } from 'react-redux'
import {
  buildPayload,
  PROPERTIES_DELETE,
  PROPERTIES_READ,
  PROPERTIES_WRITE,
} from '@/utils/PermChecker'
import { editConfig, getConfig } from 'Plugins/admin/redux/features/apiConfigSlice'
import { useCedarling } from '@/cedarling'
import { useGetAdminuiConf, getGetAdminuiConfQueryKey } from 'JansConfigApi'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'

const CedarlingConfigPage: React.FC = () => {
  const { hasCedarPermission, authorize } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.cedarling_config'))
  const [auiPolicyStoreUrl, setAuiPolicyStoreUrl] = useState('')
  const [configApiPolicyStoreUrl, setConfigApiPolicyStoreUrl] = useState('')
  const { data: auiConfig, isPending, isLoading, isSuccess } = useGetAdminuiConf()

  const dispatch = useDispatch()

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const requestData = {
      auiPolicyStoreUrl,
      useRemotePolicyStore: true,
    }
    // dispatch(editConfig({ action: userAction }))
  }

  useEffect(() => {
    const initPermissions = async () => {
      const permissions = [PROPERTIES_READ, PROPERTIES_WRITE, PROPERTIES_DELETE]
      for (const permission of permissions) {
        await authorize([permission])
      }
    }
    initPermissions()
  }, [])

  useEffect(() => {
    if (isSuccess) {
      setAuiPolicyStoreUrl(auiConfig?.auiPolicyStoreUrl || '')
      // dispatch(getConfig())
    }
  }, [isSuccess])

  return (
    <GluuLoader blocking={isLoading}>
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
                <a
                  href="https://cloud.gluu.org/agama-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agama-Lab
                </a>
                .
              </CardText>
            </Card>

            <Form onSubmit={handleSubmit}>
              <FormGroup row>
                <GluuLabel label={'fields.auiPolicyStoreUrl'} />
                <Col sm={9}>
                  <Input
                    id="auiPolicyStoreUrl"
                    type="url"
                    name="auiPolicyStoreUrl"
                    value={auiPolicyStoreUrl}
                    onChange={(e) => setAuiPolicyStoreUrl(e.target.value)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={'fields.configApiPolicyStoreUrl'} />
                <Col sm={9}>
                  <Input
                    id="configApiPolicyStoreUrl"
                    type="url"
                    name="configApiPolicyStoreUrl"
                    value={configApiPolicyStoreUrl}
                    onChange={(e) => setConfigApiPolicyStoreUrl(e.target.value)}
                  />
                </Col>
              </FormGroup>

              {/* 
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
            </FormGroup> */}

              <div className="text-center mt-4">
                <Button color="dark" size="lg" type="submit">
                  {t('actions.apply')}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Col>
      </Card>
    </GluuLoader>
  )
}

export default CedarlingConfigPage
