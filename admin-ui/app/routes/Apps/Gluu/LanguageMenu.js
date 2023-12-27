import React, { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'Components'
import { ThemeContext } from "Context/theme/themeContext"

const LanguageMenu = ({ userInfo }) => {
  const [isOpen, setOpen] = useState(false)
  const initLang = localStorage.getItem('initLang') || 'en'
  const initTheme = localStorage.getItem('initTheme') || 'darkBlack'
  const userConfig = JSON.parse(localStorage.getItem('userConfig'))
  const userConfigLang = userConfig && userConfig !== 'null' ? userConfig?.lang : {}
  const userConfigTheme = userConfig && userConfig !== 'null' ? userConfig?.theme : {}
  const [lang, setLang] = useState('en')
  const [langUpdated, setLangUpdated] = useState(false)
  const [themeUpdated, setThemeUpdated] = useState(false)
  const { t, i18n } = useTranslation()
  const { inum } = userInfo
  const toggle = () => setOpen(!isOpen)
  const themeContext = useContext(ThemeContext)

  function changeLanguage(code) {
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
  // style={{ border: '1px solid #9a9a9a', paddingRight: '24px' }}
  return (
    <ButtonDropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle caret color='transparent' style={{ border: '1px solid #9a9a9a', fontSize: '12px' }} data-testid="ACTIVE_LANG">
        <span style={{ color: '#fff' }}>{lang}</span>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => changeLanguage('fr')} data-testid="FRE">
          {t('languages.french')}
        </DropdownItem>
        <DropdownItem onClick={() => changeLanguage('pt')} data-testid="POR">
          {t('languages.portuguese')}
        </DropdownItem>
        <DropdownItem onClick={() => changeLanguage('en')} data-testid="ENG">
          {t('languages.english')}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  )
}
export { LanguageMenu }
