import "@babel/polyfill";
import { I18nextProvider } from "react-i18next";
import React, { Suspense } from "react";
import i18next from "./i18n";
import { render } from "react-dom";
import App from "./components/App";

render(
  <I18nextProvider i18n={i18next}>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </I18nextProvider>,
  document.querySelector("#root")
);
