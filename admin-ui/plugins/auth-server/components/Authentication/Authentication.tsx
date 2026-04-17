import { type ReactElement, useMemo, useState, useCallback, useRef } from 'react'
import { Add } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import { GluuPageContent } from '@/components'
import { GluuButton } from '@/components/GluuButton'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useLocation } from 'react-router-dom'

import DefaultAcr from './DefaultAcr/DefaultAcr'
import BuiltIn from './BuiltIn/BuiltIn'
import Acrs from './Acrs/Acrs'
import Aliases from './Aliases/Aliases'
import AgamaFlows from './AgamaFlows/AgamaFlows'
import { useStyles } from './styles/Authentication.style'
import { ALIASES_TAB_INDEX } from './constants'

type TabName = {
  id: string
  name: string
  path: string
}

function Authentication(): ReactElement {
  const { t } = useTranslation()
  const location = useLocation()
  const defaultTab: number = (location.state as { authnTab?: number } | null)?.authnTab ?? 0

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [canEditAliases, setCanEditAliases] = useState(false)
  const aliasAddHandlerRef = useRef<(() => void) | null>(null)

  const handleRegisterAliasAdd = useCallback((fn: () => void) => {
    aliasAddHandlerRef.current = fn
  }, [])

  const handleAddMapping = useCallback(() => {
    aliasAddHandlerRef.current?.()
  }, [])

  const tabNames = useMemo<TabName[]>(
    () => [
      { id: 'default_acr', name: t('menus.default_acr'), path: '' },
      { id: 'builtIn', name: t('menus.builtIn'), path: '' },
      { id: 'acrs', name: t('menus.acrs'), path: '' },
      { id: 'aliases', name: t('menus.aliases'), path: '' },
      { id: 'agama_flows', name: t('menus.agama_flows'), path: '' },
    ],
    [t],
  )

  const addMappingButton = useMemo(
    () =>
      activeTab === ALIASES_TAB_INDEX && canEditAliases ? (
        <GluuButton
          type="button"
          size="md"
          padding="10px 20px"
          minHeight={44}
          backgroundColor={themeColors.formFooter?.apply?.backgroundColor}
          textColor={themeColors.formFooter?.apply?.textColor}
          borderColor={themeColors.formFooter?.apply?.backgroundColor}
          useOpacityOnHover
          onClick={handleAddMapping}
        >
          <Add className={classes.addIcon} />
          {t('actions.add_mapping')}
        </GluuButton>
      ) : null,
    [activeTab, canEditAliases, themeColors, handleAddMapping, t, classes],
  )

  const tabToShow = useCallback(
    (tabId: string): ReactElement | undefined => {
      switch (tabId) {
        case 'default_acr':
          return <DefaultAcr />
        case 'builtIn':
          return <BuiltIn />
        case 'acrs':
          return <Acrs />
        case 'aliases':
          return (
            <Aliases
              onRegisterAddHandler={handleRegisterAliasAdd}
              onWritePermissionChange={setCanEditAliases}
            />
          )
        case 'agama_flows':
          return <AgamaFlows />
        default:
          return undefined
      }
    },
    [handleRegisterAliasAdd],
  )

  return (
    <GluuPageContent>
      <div className={classes.formCard}>
        <div className={classes.content}>
          <GluuTabs
            tabNames={tabNames}
            tabToShow={tabToShow}
            withNavigation={true}
            defaultTab={defaultTab}
            rightAction={addMappingButton}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </GluuPageContent>
  )
}

export default Authentication
