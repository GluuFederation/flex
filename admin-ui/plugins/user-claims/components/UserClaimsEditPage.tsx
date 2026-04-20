import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Alert } from '@mui/material'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import UserClaimsForm from 'Plugins/user-claims/components/UserClaimsForm'
import { useStyles } from './styles/UserClaimsFormPage.style'
import { cloneDeep } from 'lodash'
import { useAttribute, useUpdateAttribute, useMutationEffects } from '../hooks'
import { getDefaultAttributeItem } from '../utils'
import { DEFAULT_ATTRIBUTE_VALIDATION } from '../helper'
import { getErrorMessage } from '@/utils/errorHandler'
import type { AttributeItem, SubmitData } from './types'
import type { JansAttribute } from 'JansConfigApi'

const attributeResourceId = ADMIN_UI_RESOURCES.Attributes

const UserClaimsEditPage = (): JSX.Element => {
  const { gid } = useParams<{ gid: string }>()
  const { t } = useTranslation()

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarReadPermission } = useCedarling()
  const canRead = useMemo(
    () => hasCedarReadPermission(attributeResourceId),
    [hasCedarReadPermission],
  )

  SetTitle(t('titles.edit_attribute', { defaultValue: 'Edit User Claim' }))

  const inum = gid || ''

  const { data: attribute, isLoading, error: queryError } = useAttribute(inum)

  const updateMutation = useUpdateAttribute()

  useMutationEffects({
    mutation: updateMutation,
    successMessage: 'messages.attribute_updated_successfully',
    errorMessage: 'errors.attribute_update_failed',
  })

  const defaultAttribute = useMemo(() => getDefaultAttributeItem(), [])

  const extensibleItems = useMemo(() => {
    if (!attribute) return defaultAttribute
    const cloned = cloneDeep(attribute) as JansAttribute

    if (!cloned.attributeValidation) {
      cloned.attributeValidation = { ...DEFAULT_ATTRIBUTE_VALIDATION }
    }

    return cloned
  }, [attribute, defaultAttribute])

  const customHandleSubmit = useCallback(
    async ({ data, userMessage, modifiedFields }: SubmitData): Promise<void> => {
      if (data) {
        await updateMutation.mutateAsync({
          data: data as JansAttribute,
          userMessage,
          modifiedFields,
        })
      }
    },
    [updateMutation],
  )

  const isBlocking = useMemo(
    () => isLoading || updateMutation.isPending,
    [isLoading, updateMutation.isPending],
  )

  if (queryError && !isLoading) {
    return (
      <GluuPageContent>
        <GluuViewWrapper canShow={canRead}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <Alert severity="error">
                <GluuText variant="span" disableThemeColor>
                  {getErrorMessage(queryError, 'errors.attribute_load_failed', t)}
                </GluuText>
              </Alert>
            </div>
          </div>
        </GluuViewWrapper>
      </GluuPageContent>
    )
  }

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canRead}>
        <GluuLoader blocking={isBlocking}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <UserClaimsForm
                item={extensibleItems as AttributeItem}
                customOnSubmit={customHandleSubmit}
              />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default UserClaimsEditPage
