import i18n from '../../../../../i18n'
import { ThemeProvider } from '../../../../../context/theme/themeContext'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { ReactNode, FC } from 'react'

interface AppTestWrapperProps {
  children: ReactNode
}

const AppTestWrapper: FC<AppTestWrapperProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>{children}</ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  )
}

export default AppTestWrapper
