import { useMemo, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption, ChevronIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import { useThemePersistence } from '@/hooks/useThemePersistence'
import { useStyles } from './styles/ThemeDropdown.style'
import type { ThemeDropdownComponentProps } from './types'

export const ThemeDropdownComponent = memo<ThemeDropdownComponentProps>(({ userInfo }) => {
  const { t } = useTranslation()
  const { state } = useTheme()
  const currentTheme = state.theme
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  const onChangeTheme = useThemePersistence(userInfo)

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
      {
        value: THEME_LIGHT,
        label: (
          <GluuText variant="span" className={classes.optionLabel} disableThemeColor>
            {t('themes.light')}
          </GluuText>
        ),
      },
      {
        value: THEME_DARK,
        label: (
          <GluuText variant="span" className={classes.optionLabel} disableThemeColor>
            {t('themes.dark')}
          </GluuText>
        ),
      },
    ],
    [classes, t],
  )

  return (
    <GluuDropdown
      renderTrigger={(isOpen) => (
        <Box className={classes.trigger}>
          <GluuText variant="span" disableThemeColor>
            {t('themes.theme')}
          </GluuText>
          <Box className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ''}`}>
            <ChevronIcon />
          </Box>
        </Box>
      )}
      options={options}
      position="bottom"
      selectedValue={currentTheme}
      onSelect={(value) => onChangeTheme(value)}
      minWidth={120}
      showArrow={true}
    />
  )
})

ThemeDropdownComponent.displayName = 'ThemeDropdownComponent'
