import React, { memo, useMemo } from 'react'
import { useMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import SetTitle from 'Utils/SetTitle'
import AssetForm from './AssetForm'
import { useStyles } from './JansAssetFormPage.style'
import { T_KEYS } from './constants'

const assetResourceId = ADMIN_UI_RESOURCES.Assets

const JansAssetFormPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { canRead: canReadAssets, canWrite: canWriteAssets } = usePermission(assetResourceId)

  const addMatch = useMatch(ROUTES.ASSET_ADD)
  const viewMatch = useMatch(ROUTES.ASSET_VIEW_TEMPLATE)

  const isAdd = !!addMatch
  const viewOnly = !isAdd && (!!viewMatch || !canWriteAssets)

  const titleKey = useMemo(() => {
    if (isAdd) return T_KEYS.TITLE_ASSET_ADD
    return viewOnly ? T_KEYS.TITLE_ASSET_VIEW : T_KEYS.TITLE_ASSET_EDIT
  }, [isAdd, viewOnly])

  SetTitle(t(titleKey))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={viewOnly ? canReadAssets : canWriteAssets}>
        <GluuText variant="h1" className={classes.mobilePageTitle} disableThemeColor>
          {t(titleKey)}
        </GluuText>
        <div className={classes.formCard}>
          <div className={classes.content}>
            <AssetForm viewOnly={viewOnly} />
          </div>
        </div>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(JansAssetFormPage)
