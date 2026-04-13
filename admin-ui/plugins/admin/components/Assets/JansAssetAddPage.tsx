import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import { useAppSelector } from '@/redux/hooks'
import AssetForm from './AssetForm'
import { useStyles } from './JansAssetFormPage.style'
import { T_KEYS } from './constants'

const assetResourceId = ADMIN_UI_RESOURCES.Assets

const JansAssetAddPage: React.FC = () => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarReadPermission } = useCedarling()
  const canReadAssets = useMemo(
    () => hasCedarReadPermission(assetResourceId),
    [hasCedarReadPermission],
  )

  const loading = useAppSelector((state) => state.assetReducer?.loading ?? false)

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
