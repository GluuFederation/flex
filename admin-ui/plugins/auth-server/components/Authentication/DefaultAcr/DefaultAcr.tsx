import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useQueryClient } from '@tanstack/react-query'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
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
import { getScripts } from 'Redux/features/initSlice'
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

interface CustomScript {
  name: string
  scriptType: string
  enabled: boolean
}

interface RootState {
  initReducer: {
    scripts: CustomScript[]
    loadingScripts: boolean
  }
}

interface DefaultAcrFormValues {
  defaultAcr: string
}

const MAX_AGAMA_PROJECTS_FOR_ACR = 500

function DefaultAcr(): React.ReactElement {
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { logAcrUpdate } = useAcrAudit()

  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const loadingScripts = useSelector((state: RootState) => state.initReducer.loadingScripts)

  // Fetch ACR config using Orval hook
  const {
    data: acrs,
    isLoading: acrLoading,
    error: acrError,
  } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  // Mutation for updating ACR
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

  // Fetch Agama projects using React Query
  const {
    data: projectsResponse,
    isLoading: agamaLoading,
    error,
  } = useGetAgamaPrj({
    count: MAX_AGAMA_PROJECTS_FOR_ACR,
    start: 0,
  })

  const { t } = useTranslation()

  const [modal, setModal] = useState<boolean>(false)
  SetTitle(t('titles.authentication'))

  const { state: themeState } = useTheme()
  const selectedTheme = themeState.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors })

  const authResourceId = ADMIN_UI_RESOURCES.Authentication
  const authScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[authResourceId] || [], [authResourceId])

  const canReadAuth = useMemo(
    () => hasCedarReadPermission(authResourceId),
    [hasCedarReadPermission, authResourceId],
  )
  const canWriteAuth = useMemo(
    () => hasCedarWritePermission(authResourceId),
    [hasCedarWritePermission, authResourceId],
  )

  useEffect(() => {
    if (authScopes && authScopes.length > 0) {
      authorizeHelper(authScopes)
    }
  }, [authorizeHelper, authScopes])

  useEffect(() => {
    dispatch(getScripts({ action: { action_data: null } }))
  }, [dispatch])

  // Surface ACR fetch failures
  useEffect(() => {
    if (acrError) {
      const errorMessage = (acrError as Error)?.message || 'Failed to fetch ACR configuration'
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }, [acrError, dispatch])

  // Surface Agama fetch failures
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error as Error)?.message ||
        'Failed to fetch Agama projects. Only showing authentication scripts.'
      dispatch(updateToast(true, 'error', errorMessage))
    }
  }, [error, dispatch])

  const authScripts = useMemo<DropdownOption[]>(() => {
    const filteredScripts = (scripts || [])
      .filter((item) => item?.scriptType === 'person_authentication' && item?.enabled)
      .map((item) => ({ key: item.name, value: item.name }))
    const agamaList = projectsResponse?.entries || []
    const agamaFlows = buildAgamaFlowsArray(agamaList)
    const dropdownOptions = buildDropdownOptions(filteredScripts, agamaFlows)

    return dropdownOptions
  }, [scripts, projectsResponse])

  const selectOptions = useMemo(
    () =>
      authScripts.map((item) =>
        typeof item === 'object'
          ? { value: item.value, label: item.label }
          : { value: item, label: item },
      ),
    [authScripts],
  )

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
      setModal(true)
    },
  })

  const handleCancel = useCallback((): void => {
    formik.resetForm()
  }, [formik])

  const submitForm = async (userMessage: string): Promise<void> => {
    toggle()

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
        devLogger.error('Failed to log ACR update:', auditError)
        dispatch(
          updateToast(
            true,
            'warning',
            t('messages.audit_log_failed', 'Update succeeded, but audit logging failed'),
          ),
        )
      }
    } catch {
      // Mutation error handling is done in onError callback
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
                values={selectOptions}
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
