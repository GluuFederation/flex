import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import UserClaimsForm from 'Plugins/user-claims/components/UserClaimsForm'
import { useStyles } from './styles/UserClaimsFormPage.style'
import { useCreateAttribute, useMutationEffects } from '../hooks'
import type { AttributeItem, SubmitData } from './types/UserClaimsListPage.types'
import type { JansAttribute } from 'JansConfigApi'

const attributeResourceId = ADMIN_UI_RESOURCES.Attributes

const UserClaimsAddPage = (): JSX.Element => {
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

  const { hasCedarWritePermission } = useCedarling()
  const canWrite = useMemo(
    () => hasCedarWritePermission(attributeResourceId),
    [hasCedarWritePermission],
  )

  SetTitle(t('fields.add_attribute', { defaultValue: 'Add User Claim' }))

  const createMutation = useCreateAttribute()

  useMutationEffects({
    mutation: createMutation,
    successMessage: 'messages.attribute_added_successfully',
    errorMessage: 'errors.attribute_create_failed',
  })

  const onSubmit = useCallback(
    async ({ data, userMessage }: SubmitData): Promise<void> => {
      if (data) {
        await createMutation.mutateAsync({
          data: data as JansAttribute,
          userMessage,
        })
      }
    },
    [createMutation],
  )

  const defaultAttribute: Partial<AttributeItem> = {
    jansHideOnDiscovery: false,
    selected: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    required: false,
    attributeValidation: { maxLength: null, regexp: null, minLength: null },
    editType: [],
    viewType: [],
    usageType: [],
  }

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canWrite}>
        <GluuLoader blocking={createMutation.isPending}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <UserClaimsForm item={defaultAttribute as AttributeItem} customOnSubmit={onSubmit} />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default UserClaimsAddPage
