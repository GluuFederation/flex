import React from 'react';
import { Link } from 'react-router-dom';

import {
  Container,
} from './../../../components';
import { useTranslation } from 'react-i18next'

export const SidebarDefault = () => {
  const { t } = useTranslation()
  return (
    <Container>
      <h1 className="display-4 mb-4 mt-2">{t("Sidebar")} &amp; {t("Navbar")}</h1>
          
      <p className="mb-5">
        {t("Welcome to the")} <b>&quot; Airframe&quot;</b> {t("Admin Dashboard Theme based on")} <a href="https://getbootstrap.com" className="text-primary" target="_blank" rel="noopener noreferrer">Bootstrap 4.x</a> {t("version for React called")}&nbsp;
        <a href="https://reactstrap.github.io" className="text-primary" target="_blank" rel="noopener noreferrer">reactstrap</a> - {t("easy to use React Bootstrap 4 components compatible with React 16+.")}
      </p>

      <section className="mb-5">
        <h6>
          {t("Layouts for this framework")}:
        </h6>
        <ul className="pl-3">
          <li>
            <Link to="/layouts/navbar" className="text-primary">{t("Navbar")}</Link>
          </li>
          <li>
            <Link to="/layouts/sidebar" className="text-primary">{t("Sidebar")}</Link>
          </li>
          <li>
            <Link to="/layouts/sidebar-with-navbar" className="text-primary">Sidebar with Navbar</Link>
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h6>
          {t("This Starter has")}:
        </h6>
        <ul className="pl-3">
          <li>
            <a href="https://webkom.gitbook.io/spin/v/airframe/airframe-react/documentation-react" className="text-primary" target="_blank" rel="noopener noreferrer">{t("Documentation")}</a> - {t("which describes how to configure this version")}.
          </li>
          <li>
            <a href="https://webkom.gitbook.io/spin/v/airframe/airframe-react/credits-react" className="text-primary" target="_blank" rel="noopener noreferrer">{t("Credits")}</a> - {t("technical details of which versions are used for this framework")}.
          </li>
          <li>
            <a href="https://webkom.gitbook.io/spin/v/airframe/airframe-react/roadmap-react" className="text-primary" target="_blank" rel="noopener noreferrer">{t("Roadmap")}</a> - {t("update for this technology for the coming months")}.
          </li>
          <li>
            <b>{t("Bugs")}</b> - {t("do you see errors in this version? Please report vie email")}: <i>info@webkom.co</i>
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h6>
          {t("Other versions for")} &quot;Airframe&quot;:
        </h6>
        <ul className="pl-3">
          <li>
            <a href="http://dashboards.webkom.co/jquery/airframe" className="text-primary">jQuery</a> - {t("based on the newest")} <i>Bootstrap 4.x</i>
          </li>
          <li>
            <a href="http://dashboards.webkom.co/react/airframe" className="text-primary">React</a> - {t("based on the newest")} <i>Reactstrap</i>
          </li>
          <li>
            <a href="http://dashboards.webkom.co/react-next/airframe" className="text-primary">Next.js (React)</a> - {t("based on the newest")} <i>Reactstrap</i> and <i>Next.js</i>
          </li>
          <li>
            <a href="http://dashboards.webkom.co/angular/airframe" className="text-primary">Angular</a> - {t("based on the newest")} <i>ng-bootstrap</i>
          </li>
          <li>
            <a href="http://dashboards.webkom.co/net-mvc/airframe" className="text-primary">.NET MVC</a> - {t("based on the newest")} <i>Bootstrap 4.x</i>
          </li>
          <li>
            <a href="http://dashboards.webkom.co/vue/airframe" className="text-primary">Vue.js</a> - {t("based on the newest")} <i>BootstrapVue</i>
          </li>
          <li>
            <b>{t("Other Versions")}</b>, {t("such as")} <i>Ruby on Rails, Ember, Laravel etc.</i>, {t("please ask for the beta version via email")}: info@webkom.co
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h6>
          {t("Work Orders")}:
        </h6>
        <p>
          {t("Regarding configuration, changes under client")}&apos;s {t("requirements")}.<br />
          {t("Pleace contact us through the")} <a href="http://wbkom.co/contact" className="text-primary" target="_blank" rel="noopener noreferrer">webkom.co/contact</a> {t("website")}.
        </p>
      </section>
    </Container>
  );
}
