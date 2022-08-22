import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'Components'

const LanguageMenu = () => {
  const [isOpen, setOpen] = useState(false)
  const initLang = localStorage.getItem('initLang')
  const [lang, setLang] = useState('en')
  const { t, i18n } = useTranslation()
  const toggle = () => setOpen(!isOpen)

  function changeLanguage(code) {
    i18n.changeLanguage(code)
    setLang(code)
    localStorage.setItem('initLang', code)
  }

  useEffect(() => {
    i18n.changeLanguage(initLang)
    const currentLang = initLang ? initLang : 'en'
    setLang(currentLang)
  }, [initLang])

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
