import { use, useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption, ChevronIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { ThemeContext } from 'Context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useLangPersistence } from '@/hooks/useLangPersistence'
import { LANG_CODES } from '@/constants'
import { useStyles } from './styles/LanguageMenu.style'
import type { LanguageMenuProps } from './types'

const LanguageMenu = memo<LanguageMenuProps>(({ userInfo }) => {
  const { t } = useTranslation()
  const { inum } = userInfo
  const themeContext = use(ThemeContext)
  const currentTheme = themeContext?.state?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  const { lang, changeLanguage } = useLangPersistence(inum)

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      { value: LANG_CODES.EN, label: t('languages.english') },
      { value: LANG_CODES.FR, label: t('languages.french') },
      { value: LANG_CODES.PT, label: t('languages.portuguese') },
      { value: LANG_CODES.ES, label: t('languages.spanish') },
    ],
    [t],
  )

  return (
    <GluuDropdown
      renderTrigger={(isOpen) => (
        <Box className={classes.trigger} data-testid="ACTIVE_LANG">
          <GluuText variant="span" disableThemeColor>
            {lang.toUpperCase()}
          </GluuText>
          <Box className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ''}`}>
            <ChevronIcon />
          </Box>
        </Box>
      )}
      options={options}
      position="bottom"
      selectedValue={lang}
      onSelect={changeLanguage}
      minWidth={67}
      showArrow={true}
    />
  )
})

LanguageMenu.displayName = 'LanguageMenu'

export { LanguageMenu }
