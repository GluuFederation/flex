import { use, useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import logo from 'Images/logos/logo192.png'
import { ThemeContext } from '@/context/theme/themeContext'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import getThemeColor from '@/context/theme/config'
import { useStyles } from './SignedOut.style'

type SignedOutProps = {
  onSignIn: () => void
}

const SignedOut = ({ onSignIn }: SignedOutProps) => {
  const { t } = useTranslation()
  const themeContext = use(ThemeContext)
  const theme = themeContext?.state.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(theme), [theme])
  const { classes } = useStyles({ isDark: theme === THEME_DARK, themeColors })
  const titleId = useId()

  return (
    <main className={classes.page} aria-labelledby={titleId}>
      <img src={logo} alt="Gluu" className={classes.logo} />
      <section className={classes.card}>
        <h1 id={titleId} className={classes.title}>
          {t('sessionEndedMessage')}
        </h1>
        <p className={classes.description}>{t('sessionEndedDescription')}</p>
        <button type="button" className={classes.button} onClick={onSignIn}>
          {t('signInAgain')}
        </button>
      </section>
    </main>
  )
}

export default SignedOut
