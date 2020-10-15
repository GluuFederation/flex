import React from "react";
import { Redirect } from "react-router-dom";
import { DefaultLayout, HeaderNavigation, IconSidebar } from "./layouts";
import HomePage from "./views/HomePage";
import HeaderNav from "./views/HeaderNavigation";
import AttributeListPage from "./views/identities/AttributeListPage";
import AttributeAddPage from "./views/identities/AttributeAddPage";

import OpenIdClientListPage from "./views/sso/OpenIdClientListPage";
import OpenIdClientAddPage from "./views/sso/OpenIdClientAddPage";

import OpenIdScopeListPage from "./views/sso/OpenIdScopeListPage";
import OpenIdScopeAddPage from "./views/sso/OpenIdScopeAddPage";

import UmaRessourceListPage from "./views/sso/UmaRessourceListPage";
import UmaScopeListPage from "./views/sso/UmaScopeListPage";

import OpenIdSectorListPage from "./views/sso/OpenIdSectorListPage";
import OpenIdSectorAddPage from "./views/sso/OpenIdSectorAddPage";

import UserProfilePage from "./views/profile/UserProfilePage";
import ErrorPage from "./views/ErrorPage";
import ChangePasswordPage from "./views/profile/ChangePasswordPage";

const BlankIconSidebarLayout = ({ children }) => (
  <IconSidebar noNavbar noFooter>
    {children}
  </IconSidebar>
);

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/home" />
  },
  {
    path: "/home",
    layout: DefaultLayout,
    component: HomePage
  },
  {
    path: "/attributes",
    layout: DefaultLayout,
    component: AttributeListPage
  },
  {
    path: "/attribute_add",
    layout: DefaultLayout,
    component: AttributeAddPage
  },
  {
    path: "/openid_scopes",
    layout: DefaultLayout,
    component: OpenIdScopeListPage
  },
  {
    path: "/openid_scope_add",
    layout: DefaultLayout,
    component: OpenIdScopeAddPage
  },
  {
    path: "/openid_clients",
    layout: DefaultLayout,
    component: OpenIdClientListPage
  },
  {
    path: "/openid_client_add",
    layout: DefaultLayout,
    component: OpenIdClientAddPage
  },
  {
    path: "/openid_sector_identifiers",
    layout: DefaultLayout,
    component: OpenIdSectorListPage
  },
  {
    path: "/openid_sector_add",
    layout: DefaultLayout,
    component: OpenIdSectorAddPage
  },
  {
    path: "/uma_ressources",
    layout: DefaultLayout,
    component: UmaRessourceListPage
  },
  {
    path: "/uma_ressource_add",
    layout: DefaultLayout,
    component: ErrorPage
  },
  {
    path: "/uma_scopes",
    layout: DefaultLayout,
    component: UmaScopeListPage
  },
  {
    path: "/me",
    layout: DefaultLayout,
    component: UserProfilePage
  },
  {
    path: "/changepw",
    layout: DefaultLayout,
    component: ChangePasswordPage
  },
  {
    path: "/header-navigation",
    layout: HeaderNavigation,
    component: HeaderNav
  },
  {
    path: "/icon-sidebar-nav",
    layout: IconSidebar,
    component: HomePage
  }
];
