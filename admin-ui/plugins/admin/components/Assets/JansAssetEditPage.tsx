import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import AssetForm from './AssetForm'
import { useStyles } from './JansAssetFormPage.style'
import { T_KEYS } from './constants'

const assetResourceId = ADMIN_UI_RESOURCES.Assets

const JansAssetEditPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t(T_KEYS.TITLE_ASSET_EDIT))

  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarReadPermission } = useCedarling()
  const canReadAssets = useMemo(
    () => hasCedarReadPermission(assetResourceId),
    [hasCedarReadPermission],
  )

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadAssets}>
        <div className={classes.formCard}>
          <div className={classes.content}>
            <AssetForm />
          </div>
        </div>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(JansAssetEditPage)
