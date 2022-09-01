import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'Components'

const LanguageMenu = ({ userInfo }) => {
  const [isOpen, setOpen] = useState(false)
  const initLang = localStorage.getItem('initLang')
  const userConfig = JSON.parse(localStorage.getItem('userConfig'))
  const userConfigLang = userConfig?.lang || {}
  const [lang, setLang] = useState('en')
  const { t, i18n } = useTranslation()
  const { inum } = userInfo
  const toggle = () => setOpen(!isOpen)

  function changeLanguage(code) {
    i18n.changeLanguage(code)
    setLang(code)

    let lang = { ...userConfigLang }
    const theme = userConfig?.theme || {}

    if (inum) {
      lang = { [inum]: code }
    }

    const newConfig = { lang, theme }
    localStorage.setItem('userConfig', JSON.stringify(newConfig))
  }

  useEffect(() => {
    const currentLang = userConfigLang[inum] ? userConfigLang[inum] : initLang
    i18n.changeLanguage(currentLang)
    setLang(currentLang)
  }, [initLang, userConfigLang])

  return (
    <ButtonDropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle caret color="transparent" data-testid="ACTIVE_LANG">
        {lang}
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
