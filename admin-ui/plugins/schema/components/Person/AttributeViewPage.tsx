import { useMemo } from 'react'
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
import AttributeForm from 'Plugins/schema/components/Person/AttributeForm'
import { useStyles } from './styles/AttributeFormPage.style'
import { cloneDeep } from 'lodash'
import { useAttribute } from '../../hooks'
import { getErrorMessage } from '../../utils/errorHandler'
import { getDefaultAttributeItem } from '../../utils/formHelpers'
import { DEFAULT_ATTRIBUTE_VALIDATION } from '../../helper/utils'
import type { AttributeItem } from '../types/AttributeListPage.types'
import type { JansAttribute } from 'JansConfigApi'

const attributeResourceId = ADMIN_UI_RESOURCES.Attributes

function AttributeViewPage(): JSX.Element {
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

  SetTitle(t('titles.view_attribute', { defaultValue: 'View Attribute' }))

  const inum = gid?.replace(':', '') || ''

  const {
    data: attribute,
    isLoading,
    error: queryError,
  } = useAttribute(inum)

  const defaultAttribute = useMemo(() => getDefaultAttributeItem(), [])

  const extensibleItems = useMemo(() => {
    if (!attribute) return defaultAttribute
    const cloned = cloneDeep(attribute) as JansAttribute

    if (!cloned.attributeValidation) {
      cloned.attributeValidation = { ...DEFAULT_ATTRIBUTE_VALIDATION }
    }

    return cloned
  }, [attribute, defaultAttribute])

  function customHandleSubmit(): void {}

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
        <GluuLoader blocking={isLoading}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <AttributeForm
                item={extensibleItems as AttributeItem}
                customOnSubmit={customHandleSubmit}
                hideButtons={{ save: true, back: true }}
              />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default AttributeViewPage
