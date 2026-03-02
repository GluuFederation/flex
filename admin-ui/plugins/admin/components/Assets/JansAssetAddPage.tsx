import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import AssetForm from './AssetForm'
import { useStyles } from './JansAssetFormPage.style'
import { RootStateForAssetForm } from './types/FormTypes'
import { T_KEYS } from './constants'

const JansAssetAddPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarReadPermission } = useCedarling()
  const assetResourceId = useMemo(() => ADMIN_UI_RESOURCES.Assets, [])
  const canReadAssets = useMemo(
    () => hasCedarReadPermission(assetResourceId),
    [hasCedarReadPermission, assetResourceId],
  )

  const loading = useSelector((state: RootStateForAssetForm) => state.assetReducer.loading)

  SetTitle(t(T_KEYS.TITLE_ASSET_ADD))

  return (
    <GluuLoader blocking={loading}>
      <GluuPageContent>
        <GluuViewWrapper canShow={canReadAssets}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <AssetForm />
            </div>
          </div>
        </GluuViewWrapper>
      </GluuPageContent>
    </GluuLoader>
  )
}

export default memo(JansAssetAddPage)
