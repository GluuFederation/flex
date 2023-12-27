import i18n from '../../../../../i18n'
import { ThemeProvider } from 'Context/theme/themeContext'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom';

const AppTestWrapper = (props) => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>{props.children}</ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default AppTestWrapper;
