import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'

const LanguageMenu = ({ userInfo }: any) => {
  const [isOpen, setOpen] = useState(false)
  const initLang = localStorage.getItem('initLang') || 'en'
  const initTheme = localStorage.getItem('initTheme') || 'darkBlack'
  const userConfig = JSON.parse(localStorage.getItem('userConfig') as string)
  const userConfigLang = userConfig && userConfig !== 'null' ? userConfig?.lang : {}
  const userConfigTheme = userConfig && userConfig !== 'null' ? userConfig?.theme : {}
  const [lang, setLang] = useState('en')
  const [langUpdated, setLangUpdated] = useState(false)
  const [themeUpdated, setThemeUpdated] = useState(false)
  const { t, i18n } = useTranslation()
  const { inum } = userInfo
  const toggle = () => setOpen(!isOpen)
  const themeContext: any = useContext(ThemeContext)

  function changeLanguage(code: any) {
    i18n.changeLanguage(code)
    setLang(code)
    let lang = { ...userConfigLang }
    if (inum) {
      lang = { [inum]: code }
    }
    const newConfig = { lang, theme: userConfigTheme }
    localStorage.setItem('userConfig', JSON.stringify(newConfig))
  }

  useEffect(() => {
    const currentLang = userConfigLang[inum] ? userConfigLang[inum] : initLang
    const currentTheme = userConfigTheme[inum] ? userConfigTheme[inum] : initTheme

    if (currentLang !== initLang && !langUpdated) {
      i18n.changeLanguage(currentLang)
      setLang(currentLang)
      setLangUpdated(true)
    }

    if (currentTheme !== initTheme && !themeUpdated) {
      themeContext.dispatch({ type: currentTheme })
      setThemeUpdated(true)
    }
  }, [userConfigLang, userConfigTheme, langUpdated, themeUpdated])

  return (
    <ButtonDropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle
        caret
        color="transparent"
        style={{ border: `1px solid ${customColors.white}`, fontSize: '12px' }}
        data-testid="ACTIVE_LANG"
      >
        <span style={{ color: customColors.white }}>{lang}</span>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => changeLanguage('en')} data-testid="ENG">
          {t('languages.english')}
        </DropdownItem>
        <DropdownItem onClick={() => changeLanguage('fr')} data-testid="FRE">
          {t('languages.french')}
        </DropdownItem>
        <DropdownItem onClick={() => changeLanguage('pt')} data-testid="POR">
          {t('languages.portuguese')}
        </DropdownItem>
        <DropdownItem onClick={() => changeLanguage('es')} data-testid="ESP">
          {t('languages.spanish')}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  )
}
export { LanguageMenu }
