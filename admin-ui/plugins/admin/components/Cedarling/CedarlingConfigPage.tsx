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
import { useDispatch, useSelector } from 'react-redux'
import { PROPERTIES_DELETE, PROPERTIES_READ, PROPERTIES_WRITE } from '@/utils/PermChecker'
import { useCedarling } from '@/cedarling'
import {
  useGetAdminuiConf,
  useEditAdminuiConf,
  useSetRemotePolicyStoreAsDefault,
  useSyncRoleToScopesMappings,
} from 'JansConfigApi'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import type { AppConfigResponse } from 'JansConfigApi'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage } from 'Plugins/schema/utils/errorHandler'
import { logAudit } from '@/utils/AuditLogger'
import type { RootState } from '@/redux/sagas/types/audit'
import { UPDATE } from '@/audit/UserActionType'
import { FormControlLabel, IconButton, Radio, RadioGroup } from '@mui/material'
import { RefreshOutlined } from '@mui/icons-material'
import GluuTooltip from '@/routes/Apps/Gluu/GluuTooltip'
import { ADMIN_UI_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { useIsFetching } from '@tanstack/react-query'

const CedarlingConfigPage: React.FC = () => {
  const { authorize } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.cedarling_config'))
  const [auiPolicyStoreUrl, setAuiPolicyStoreUrl] = useState('')
  const { data: auiConfig, isSuccess } = useGetAdminuiConf()
  const isFetching = useIsFetching()

  const editAdminuiConfMutation = useEditAdminuiConf()
  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const setRemotePolicyStoreAsDefaultMutation = useSetRemotePolicyStoreAsDefault()
  const token: string | undefined = useSelector(
    (state: RootState) => state.authReducer?.token?.access_token,
  )
  const userinfo: RootState['authReducer']['userinfo'] | undefined = useSelector(
    (state: RootState) => state.authReducer?.userinfo,
  )
  const client_id: string | undefined = useSelector(
    (state: RootState) => state.authReducer?.config?.clientId,
  )
  const [policyRetrievalPoint, setPolicyRetrievalPoint] = useState('github')

  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const requestData = {
      auiPolicyStoreUrl,
      policyRetrievalPoint,
    }

    try {
      const editAppConfigResponse: AppConfigResponse = await editAdminuiConfMutation.mutateAsync({
        data: { ...auiConfig, ...requestData },
      })
      setAuiPolicyStoreUrl(editAppConfigResponse?.auiPolicyStoreUrl || '')
      dispatch(updateToast(true, 'success'))

      let userMessage: string = 'Policy Store URL configuration updated'
      await logAudit({
        token: token ?? undefined,
        userinfo: userinfo ?? undefined,
        action: UPDATE,
        resource: ADMIN_UI_CONFIG,
        message: userMessage,
        client_id: client_id,
        payload: requestData,
      })

      await syncRoleToScopesMappingsMutation.mutateAsync()

      userMessage = 'sync role to scopes mappings'
      await logAudit({
        token: token ?? undefined,
        userinfo: userinfo ?? undefined,
        action: UPDATE,
        resource: ADMIN_UI_CONFIG,
        message: userMessage,
        client_id: client_id,
        payload: requestData,
      })
    } catch (error) {
      console.error('Error updating Cedarling configuration:', error)
      const errorMessage = getErrorMessage(error, 'messages.error_in_saving', t)
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }

  const handleSetRemotePolicyStoreAsDefault = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      await setRemotePolicyStoreAsDefaultMutation.mutateAsync()

      dispatch(updateToast(true, 'success'))

      const userMessage: string = 'Set policy store as default'
      await logAudit({
        token: token ?? undefined,
        userinfo: userinfo ?? undefined,
        action: UPDATE,
        resource: ADMIN_UI_CONFIG,
        message: userMessage,
        client_id: client_id,
        payload: {},
      })
    } catch (error) {
      console.error('Error updating Cedarling configuration:', error)
      const errorMessage = getErrorMessage(error, 'messages.error_in_saving', t)
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }

  useEffect(() => {
    const permissions = [PROPERTIES_READ, PROPERTIES_WRITE, PROPERTIES_DELETE]
    Promise.allSettled(permissions.map((p) => authorize([p])))
  }, [authorize])

  useEffect(() => {
    if (isSuccess) {
      setAuiPolicyStoreUrl(auiConfig?.auiPolicyStoreUrl || '')
    }
  }, [isSuccess])

  return (
    <GluuLoader blocking={isFetching}>
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
                  href="https://github.com/duttarnab/cedarling_store/tree/agama-lab-policy-designer"
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
                <Col sm={8}>
                  <Input
                    id="auiPolicyStoreUrl"
                    type="url"
                    name="auiPolicyStoreUrl"
                    value={auiPolicyStoreUrl}
                    onChange={(e) => setAuiPolicyStoreUrl(e.target.value)}
                  />
                </Col>
                <Col sm={1}>
                  <GluuTooltip
                    doc_category={'cedarlingConfig'}
                    doc_entry={'updateRemotePolicyStoreOnServer'}
                  >
                    <IconButton
                      hidden={policyRetrievalPoint == 'github'}
                      type="button"
                      aria-label="search"
                      onClick={handleSetRemotePolicyStoreAsDefault}
                    >
                      <RefreshOutlined />
                    </IconButton>
                  </GluuTooltip>
                </Col>
              </FormGroup>
              <FormGroup row>
                <GluuLabel label={'fields.policyRetrievalPoint'} size={3} />
                <Col sm={9} className="top-5">
                  <RadioGroup
                    row
                    name="policyRetrievalPoint"
                    value={policyRetrievalPoint}
                    onChange={(e) => setPolicyRetrievalPoint(e.target.value)}
                  >
                    <FormControlLabel
                      value={'github'}
                      control={<Radio color="primary" />}
                      label="GitHub"
                      checked={policyRetrievalPoint === 'github'}
                    />
                    <FormControlLabel
                      value={'local'}
                      control={<Radio color="primary" />}
                      label={'Local'}
                      checked={policyRetrievalPoint === 'local'}
                    />
                  </RadioGroup>
                </Col>
                <Col>{t('documentation.cedarlingConfig.useRemotePolicyStore')}</Col>
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
    </GluuLoader>
  )
}

export default CedarlingConfigPage
