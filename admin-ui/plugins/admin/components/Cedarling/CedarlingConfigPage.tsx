import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardBody, FormGroup, CardTitle, CardText, Form, Input, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import GluuLabel from '@/routes/Apps/Gluu/GluuLabel'
import { useDispatch, useSelector } from 'react-redux'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import {
  useGetAdminuiConf,
  useEditAdminuiConf,
  useSetRemotePolicyStoreAsDefault,
  useSyncRoleToScopesMappings,
  getGetAdminuiConfQueryKey,
} from 'JansConfigApi'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import GluuViewWrapper from '@/routes/Apps/Gluu/GluuViewWrapper'
import GluuFormFooter from '@/routes/Apps/Gluu/GluuFormFooter'
import type {
  AppConfigResponse,
  AppConfigResponseCedarlingPolicyStoreRetrievalPoint,
} from 'JansConfigApi'
import { updateToast } from '@/redux/features/toastSlice'
import { getErrorMessage } from 'Plugins/schema/utils/errorHandler'
import { logAudit } from '@/utils/AuditLogger'
import type { RootState as AuditRootState } from '@/redux/sagas/types/audit'
import { UPDATE } from '@/audit/UserActionType'
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { RefreshOutlined, StickyNote2Outlined } from '@mui/icons-material'
import GluuTooltip from '@/routes/Apps/Gluu/GluuTooltip'
import { ADMIN_UI_CEDARLING_CONFIG } from 'Plugins/admin/redux/audit/Resources'
import { useQueryClient } from '@tanstack/react-query'
import customColors from '@/customColors'

const CedarlingConfigPage: React.FC = () => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { t } = useTranslation()
  SetTitle(t('titles.cedarling_config'))
  const [auiPolicyStoreUrl, setAuiPolicyStoreUrl] = useState('')
  const { data: auiConfig, isSuccess, isFetching } = useGetAdminuiConf()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  // Create Material-UI theme with primary color matching app theme
  const muiTheme = useMemo(() => {
    const primaryColor = customColors.logo // Use logo green as primary for all themes
    return createTheme({
      palette: {
        primary: {
          main: primaryColor,
        },
      },
    })
  }, [])

  const editAdminuiConfMutation = useEditAdminuiConf()
  const syncRoleToScopesMappingsMutation = useSyncRoleToScopesMappings()
  const setRemotePolicyStoreAsDefaultMutation = useSetRemotePolicyStoreAsDefault()
  const token: string | undefined = useSelector(
    (state: AuditRootState) => state.authReducer?.token?.access_token,
  )
  const userinfo: AuditRootState['authReducer']['userinfo'] | undefined = useSelector(
    (state: AuditRootState) => state.authReducer?.userinfo,
  )
  const client_id: string | undefined = useSelector(
    (state: AuditRootState) => state.authReducer?.config?.clientId,
  )
  const [cedarlingPolicyStoreRetrievalPoint, setCedarlingPolicyRetrievalPoint] =
    useState<AppConfigResponseCedarlingPolicyStoreRetrievalPoint>('remote')

  const dispatch = useDispatch()

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (auiPolicyStoreUrl.trim() === '') {
        const errorMessage = `${t('messages.error_in_saving')} field: ${t('fields.auiPolicyStoreUrl')} ${t('messages.is_required')}`
        dispatch(updateToast(true, 'error', errorMessage))
        return
      }

      const requestData = {
        auiPolicyStoreUrl,
        cedarlingPolicyStoreRetrievalPoint,
      }

      try {
        setIsLoading(true)
        const editAppConfigResponse: AppConfigResponse = await editAdminuiConfMutation.mutateAsync({
          data: { ...auiConfig, ...requestData },
        })
        setAuiPolicyStoreUrl(editAppConfigResponse?.auiPolicyStoreUrl || '')
        setCedarlingPolicyRetrievalPoint(
          editAppConfigResponse?.cedarlingPolicyStoreRetrievalPoint || 'remote',
        )

        let userMessage: string = 'Policy Store URL configuration updated'
        await logAudit({
          token: token ?? undefined,
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
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
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: userMessage,
          client_id: client_id,
          payload: requestData,
        })
        dispatch(updateToast(true, 'success'))
      } catch (error) {
        console.error('Error updating Cedarling configuration:', error)
        const errorMessage = getErrorMessage(error, 'messages.error_in_saving', t)
        dispatch(updateToast(true, 'error', errorMessage))
      } finally {
        queryClient.invalidateQueries({ queryKey: getGetAdminuiConfQueryKey() })
        setIsLoading(false)
      }
    },
    [
      auiPolicyStoreUrl,
      cedarlingPolicyStoreRetrievalPoint,
      t,
      dispatch,
      editAdminuiConfMutation,
      auiConfig,
      token,
      userinfo,
      client_id,
      syncRoleToScopesMappingsMutation,
      queryClient,
    ],
  )

  const handleSetRemotePolicyStoreAsDefault = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      try {
        setIsLoading(true)
        await setRemotePolicyStoreAsDefaultMutation.mutateAsync()

        dispatch(updateToast(true, 'success'))

        const userMessage: string = 'Set policy store as default'
        await logAudit({
          token: token ?? undefined,
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_CEDARLING_CONFIG,
          message: userMessage,
          client_id: client_id,
          payload: {},
        })
      } catch (error) {
        console.error('Error updating Cedarling configuration:', error)
        const errorMessage = getErrorMessage(error, 'messages.error_in_saving', t)
        dispatch(updateToast(true, 'error', errorMessage))
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, setRemotePolicyStoreAsDefaultMutation, token, userinfo, client_id, t],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAuiPolicyStoreUrl(e.target.value)
  }, [])

  const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCedarlingPolicyRetrievalPoint(
      e.target.value as AppConfigResponseCedarlingPolicyStoreRetrievalPoint,
    )
  }, [])

  const securityResourceId = useMemo(() => ADMIN_UI_RESOURCES.Security, [])
  const securityScopes = useMemo(() => {
    return CEDAR_RESOURCE_SCOPES[securityResourceId] || []
  }, [securityResourceId])
  const canReadSecurity = useMemo(
    () => hasCedarReadPermission(securityResourceId),
    [hasCedarReadPermission, securityResourceId],
  )
  const canWriteSecurity = useMemo(
    () => hasCedarWritePermission(securityResourceId),
    [hasCedarWritePermission, securityResourceId],
  )

  const isRefreshButtonHidden = useMemo(
    () => cedarlingPolicyStoreRetrievalPoint === 'remote' || auiPolicyStoreUrl.trim() === '',
    [cedarlingPolicyStoreRetrievalPoint, auiPolicyStoreUrl],
  )

  const isInputDisabled = useMemo(
    () => !canWriteSecurity || isLoading,
    [canWriteSecurity, isLoading],
  )

  useEffect(() => {
    if (securityScopes && securityScopes.length > 0) {
      authorizeHelper(securityScopes)
    }
  }, [authorizeHelper, securityScopes])

  useEffect(() => {
    if (isSuccess && auiConfig) {
      setAuiPolicyStoreUrl(auiConfig?.auiPolicyStoreUrl || '')
      setCedarlingPolicyRetrievalPoint(auiConfig?.cedarlingPolicyStoreRetrievalPoint || 'remote')
    }
  }, [isSuccess, auiConfig])

  return (
    <GluuLoader blocking={isFetching || isLoading}>
      <GluuViewWrapper canShow={canReadSecurity}>
        <Card className="shadow-sm align-items-center">
          <Col sm="7">
            <CardBody>
              <CardTitle tag="h4" className="text-center fw-bold mb-4">
                {t('documentation.cedarlingConfig.title')}
              </CardTitle>

              <Card className="bg-light border-0 p-3 mb-4">
                <CardText className="text-secondary">
                  {t('documentation.cedarlingConfig.point1')}{' '}
                  <a
                    href="https://github.com/GluuFederation/GluuFlexAdminUIPolicyStore/tree/agama-lab-policy-designer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AdminUICedarling
                  </a>
                  .
                  <br />
                  {t('documentation.cedarlingConfig.point2')}
                </CardText>
                <CardText className="text-muted small">
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
            </CardBody>
          </Col>
          <Col sm="9">
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup row>
                  <GluuLabel label={'fields.auiPolicyStoreUrl'} />
                  <Col sm={8}>
                    <Input
                      id="auiPolicyStoreUrl"
                      type="url"
                      name="auiPolicyStoreUrl"
                      value={auiPolicyStoreUrl}
                      onChange={handleInputChange}
                      disabled={isInputDisabled}
                    />
                  </Col>
                  <Col sm={1}>
                    <GluuTooltip
                      doc_category={'cedarlingConfig'}
                      doc_entry={'updateRemotePolicyStoreOnServer'}
                    >
                      <IconButton
                        hidden={isRefreshButtonHidden}
                        type="button"
                        aria-label="search"
                        onClick={handleSetRemotePolicyStoreAsDefault}
                        disabled={isInputDisabled}
                      >
                        <RefreshOutlined />
                      </IconButton>
                    </GluuTooltip>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <GluuLabel label={'fields.cedarlingPolicyStoreRetrievalPoint'} size={3} />
                  <Col sm={9} className="top-5">
                    <ThemeProvider theme={muiTheme}>
                      <RadioGroup
                        row
                        name="cedarlingPolicyStoreRetrievalPoint"
                        value={cedarlingPolicyStoreRetrievalPoint}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          value={'remote'}
                          control={<Radio color="primary" />}
                          label="Remote"
                          disabled={isInputDisabled}
                        />
                        <FormControlLabel
                          value={'default'}
                          control={<Radio color="primary" />}
                          label={'Default'}
                          disabled={isInputDisabled}
                        />
                      </RadioGroup>
                    </ThemeProvider>
                  </Col>
                  <Col>
                    <StickyNote2Outlined />
                    {t('documentation.cedarlingConfig.useRemotePolicyStore')}
                  </Col>
                </FormGroup>

                <GluuFormFooter
                  showBack={true}
                  showApply={canWriteSecurity}
                  disableApply={isLoading}
                  isLoading={isLoading}
                />
              </Form>
            </CardBody>
          </Col>
        </Card>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default React.memo(CedarlingConfigPage)
