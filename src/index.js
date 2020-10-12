import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { store } from "./redux/store/store";
import i18next from "./i18n";
import * as serviceWorker from "./serviceWorker";
ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();
