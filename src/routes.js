import React from "react";
import { Redirect } from "react-router-dom";
import { DefaultLayout, HeaderNavigation, IconSidebar } from "./layouts";
import HomePage from "./views/HomePage";
import FileManagerList from "./views/FileManagerList";
import HeaderNav from "./views/HeaderNavigation";
import GroupListPage from "./views/identities/GroupListPage";
import UserListPage from "./views/identities/UserListPage";
import AttributeListPage from "./views/identities/AttributeListPage";
import UserAddPage from "./views/identities/UserAddPage";
import OpenIdClientListPage from "./views/sso/OpenIdClientListPage";
import OpenIdScopeListPage from "./views/sso/OpenIdScopeListPage";
import GroupAddPage from "./views/identities/GroupAddPage";
import TrustListPage from "./views/sso/TrustListPage";
import TrustAcrListPage from "./views/sso/TrustAcrListPage";
import UmaRessourceListPage from "./views/sso/UmaRessourceListPage";
import ErrorPage from "./views/ErrorPage";
import UmaScopeListPage from "./views/sso/UmaScopeListPage";
import OpenIdSectorListPage from "./views/sso/OpenIdSectorListPage";
import CertificatesListPage from "./views/extra/CertificatesListPage";
import ServerStatusPage from "./views/extra/ServerStatusPage";
import UserProfilePage from "./views/profile/UserProfilePage";
import AttributeAddPage from "./views/identities/AttributeAddPage";
import OpenIdScopeAddPage from "./views/sso/OpenIdScopeAddPage";
import OpenIdClientAddPage from "./views/sso/OpenIdClientAddPage";
import ChangePasswordPage from "./views/profile/ChangePasswordPage";
import OpenIdSectorAddPage from "./views/sso/OpenIdSectorAddPage";
import TrustAddPage from "./views/sso/TrustAddPage";
import AddNewPostPage from "./views/RegistrationPage";
import PassportListPage from "./views/sso/PassportListPage";
import ProviderAddPage from "./views/sso/ProviderAddPage";
import PassportConfigPage from "./views/sso/PassportConfigPage";
import TrustNamedIdPage from "./views/sso/TrustNamedIdPage";

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
    path: "/groups",
    layout: DefaultLayout,
    component: GroupListPage
  },
  {
    path: "/group_add",
    layout: DefaultLayout,
    component: GroupAddPage
  },
  {
    path: "/users",
    layout: DefaultLayout,
    component: UserListPage
  },
  {
    path: "/user_add",
    layout: DefaultLayout,
    component: UserAddPage
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
    path: "/saml_trusts",
    layout: DefaultLayout,
    component: TrustListPage
  },
  {
    path: "/saml_trust_add",
    layout: DefaultLayout,
    component: TrustAddPage
  },
  {
    path: "/saml_acrs",
    layout: DefaultLayout,
    component: TrustAcrListPage
  },
  {
    path: "/saml_namedid",
    layout: DefaultLayout,
    component: TrustNamedIdPage
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
    path: "/uma_scope_add",
    layout: DefaultLayout,
    component: AddNewPostPage
  },
  {
    path: "/passport_providers",
    layout: DefaultLayout,
    component: PassportListPage
  },
  {
    path: "/passport_provider_add",
    layout: DefaultLayout,
    component: ProviderAddPage
  },
  {
    path: "/passport_config",
    layout: DefaultLayout,
    component: PassportConfigPage
  },
  {
    path: "/certificates",
    layout: DefaultLayout,
    component: CertificatesListPage
  },
  {
    path: "/server_status",
    layout: DefaultLayout,
    component: ServerStatusPage
  },
  {
    path: "/logs",
    layout: DefaultLayout,
    component: FileManagerList
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
