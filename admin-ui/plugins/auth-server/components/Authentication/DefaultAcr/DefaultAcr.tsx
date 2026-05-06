import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useFormik } from 'formik'
import { useQueryClient } from '@tanstack/react-query'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import {
  useGetAgamaPrj,
  useGetAcrs,
  usePutAcrs,
  getGetAcrsQueryKey,
  type AuthenticationMethod,
} from 'JansConfigApi'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { Form } from 'Components'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_SCRIPT_TYPE, useCustomScriptsByType } from 'Plugins/scripts/components'
import {
  buildAgamaFlowsArray,
  buildDropdownOptions,
  type DropdownOption,
} from '../Acrs/helper/acrUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { useAcrAudit } from '../Acrs/hooks'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { devLogger } from '@/utils/devLogger'
import { useStyles } from './DefaultAcr.style'
import { MAX_AGAMA_PROJECTS_FOR_ACR } from './constants'
import { AUTH_RESOURCE_ID, AUTH_SCOPES } from '../constants'

type DefaultAcrFormValues = {
  defaultAcr: string
}

const DefaultAcr = (): React.ReactElement => {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { logAcrUpdate } = useAcrAudit()
  const { t } = useTranslation()

  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors })

  const [modal, setModal] = useState<boolean>(false)

  const canReadAuth = useMemo(
    () => hasCedarReadPermission(AUTH_RESOURCE_ID),
    [hasCedarReadPermission],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(AUTH_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  const { data: scriptsResponse, isLoading: loadingScripts } = useCustomScriptsByType(
    DEFAULT_SCRIPT_TYPE,
    undefined,
    { enabled: canReadAuth },
  )
  const {
    data: acrs,
    isLoading: acrLoading,
    error: acrError,
  } = useGetAcrs({
    query: {
      staleTime: 30000,
      enabled: canReadAuth,
    },
  })
  const {
    data: projectsResponse,
    isLoading: agamaLoading,
    error,
  } = useGetAgamaPrj(
    { count: MAX_AGAMA_PROJECTS_FOR_ACR, start: 0 },
    { query: { enabled: canReadAuth } },
  )

  const handleUpdateSuccess = useCallback(() => {
    dispatch(updateToast(true, 'success'))
    queryClient.invalidateQueries({ queryKey: getGetAcrsQueryKey() })
  }, [dispatch, queryClient])

  const handleUpdateError = useCallback(
    (error: Error) => {
      const errorMessage = error?.message || 'Failed to update default ACR'
      dispatch(updateToast(true, 'error', errorMessage))
    },
    [dispatch],
  )

  const putAcrsMutation = usePutAcrs({
    mutation: {
      onSuccess: handleUpdateSuccess,
      onError: handleUpdateError,
    },
  })

  SetTitle(t('titles.authentication'))

  useEffect(() => {
    if (AUTH_SCOPES.length > 0) {
      authorizeHelper(AUTH_SCOPES)
    }
  }, [authorizeHelper])

  useEffect(() => {
    if (acrError) {
      const errorMessage = (acrError as Error)?.message || 'Failed to fetch ACR configuration'
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }, [acrError, dispatch])

  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as Error)?.message ||
        'Failed to fetch Agama projects. Only showing authentication scripts.'
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }, [error, dispatch])

  const authScripts = useMemo<DropdownOption[]>(() => {
    const filteredScripts = (scriptsResponse?.entries || [])
      .filter((item) => item?.enabled)
      .map((item) => ({ key: item.name as string, value: item.name as string }))
    const agamaList = projectsResponse?.entries || []
    const agamaFlows = buildAgamaFlowsArray(agamaList)
    const dropdownOptions = buildDropdownOptions(filteredScripts, agamaFlows)

    return dropdownOptions
  }, [scriptsResponse, projectsResponse])

  const toggle = useCallback((): void => {
    setModal((prev) => !prev)
  }, [])

  const initialValues: DefaultAcrFormValues = useMemo(
    () => ({ defaultAcr: acrs?.defaultAcr ?? '' }),
    [acrs?.defaultAcr],
  )

  const formik = useFormik<DefaultAcrFormValues>({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      if (canWriteAuth) {
        setModal(true)
      }
    },
  })

  const handleCancel = useCallback((): void => {
    formik.resetForm()
  }, [formik])

  const submitForm = async (userMessage: string): Promise<void> => {
    if (!canWriteAuth) {
      return
    }
    const acrValue = formik.values.defaultAcr
    if (!acrValue) {
      return
    }

    const newAcr: AuthenticationMethod = { defaultAcr: acrValue }
    try {
      await putAcrsMutation.mutateAsync({ data: newAcr })
      try {
        await logAcrUpdate(newAcr, userMessage, { defaultAcr: acrValue })
      } catch (auditError) {
        devLogger.error(
          'Failed to log ACR update:',
          auditError instanceof Error ? auditError : String(auditError),
        )
        dispatch(
          updateToast(
            true,
            'warning',
            t('messages.audit_log_failed', 'Update succeeded, but audit logging failed'),
          ),
        )
      }
    } catch (error) {
      devLogger.error('Failed to update ACR:', error instanceof Error ? error : String(error))
    }
  }

  return (
    <GluuLoader
      blocking={loadingScripts || agamaLoading || acrLoading || putAcrsMutation.isPending}
    >
      <Form onSubmit={formik.handleSubmit}>
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
        <div
          className={`${classes.defaultAcrSection} ${classes.formLabels} ${classes.formWithInputs}`}
        >
          <GluuViewWrapper canShow={canReadAuth}>
            <div className={classes.fieldItem}>
              <GluuSelectRow
                name="defaultAcr"
                label="fields.default_acr"
                lsize={12}
                rsize={12}
                value={formik.values.defaultAcr}
                formik={formik}
                values={authScripts}
                doc_category="json_properties"
                doc_entry="defaultAcr"
              />
            </div>
          </GluuViewWrapper>
        </div>
        {canWriteAuth && (
          <GluuThemeFormFooter
            hideDivider
            showBack
            showCancel
            showApply
            applyButtonType="submit"
            onCancel={handleCancel}
            disableCancel={!formik.dirty}
            disableApply={!formik.dirty}
            isLoading={putAcrsMutation.isPending}
          />
        )}
      </Form>
    </GluuLoader>
  )
}

export default DefaultAcr
