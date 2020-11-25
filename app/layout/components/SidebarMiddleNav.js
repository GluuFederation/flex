import React from "react";
import { Link } from "react-router-dom";

import { SidebarMenu, Divider, DropdownItem } from "./../../components";

export const SidebarMiddleNav = () => (
  <SidebarMenu>
    {/* -------- Home ---------*/}
    <SidebarMenu.Item icon={<i className="fa fa-fw fa-home"></i>} title="Home">
      <SidebarMenu.Item title="Analytics" to="/home/analytics" exact />
      <SidebarMenu.Item title="Reports" to="/home/reports" exact />
    </SidebarMenu.Item>
    {/* -------- Attributes ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-briefcase"></i>}
      title="Attributes"
    >
      <SidebarMenu.Item title="List" to="/cards/cards" exact />
      <SidebarMenu.Item title="Add new" to="/cards/cardsheaders" exact />
    </SidebarMenu.Item>
    {/* -------- OIDC ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-cubes"></i>}
      title="Clients"
    >
      <SidebarMenu.Item title="List" to="/layouts/navbar" exact />
      <SidebarMenu.Item title="Add new client" to="/layouts/sidebar" exact />
      <SidebarMenu.Item title="Sectors" to="/layouts/sidebar" exact />
      <SidebarMenu.Item title="Add new sector" to="/layouts/sidebar" exact />
    </SidebarMenu.Item>
    {/* -------- Scopes ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-sitemap"></i>}
      title="Scopes"
    >
      <SidebarMenu.Item title="Uma Scopes" to="/interface/breadcrumbs" />
      <SidebarMenu.Item title="New Uma Scope" to="/interface/navbars" />
      <SidebarMenu.Item title="OpenId Scopes" to="/interface/notifications" />
      <SidebarMenu.Item title="New OIDC Scope" to="/interface/crop-image" />
    </SidebarMenu.Item>
    {/* -------- Custom scripts ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-puzzle-piece"></i>}
      title="Custom Scripts"
    >
      <SidebarMenu.Item title="all" to="/layouts/navbar" exact />
      <SidebarMenu.Item title="active" to="/layouts/sidebar" exact />
      <SidebarMenu.Item title="inactive" to="/layouts/sidebar" exact />
      <SidebarMenu.Item title="Add new script" to="/layouts/sidebar" exact />
    </SidebarMenu.Item>
    {/* -------- Scopes ---------*/}
    {/* -------- Configuration ---------*/}
    <Divider />
    <Divider />
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-gears"></i>}
      title="Configuration"
    >
      <SidebarMenu.Item title="Smtp" to="/forms/forms" />
      <SidebarMenu.Item title="Fido2" to="/forms/forms-layouts" />
      <SidebarMenu.Item title="Ldap" to="/forms/input-groups" />
      <SidebarMenu.Item title="Couchbase" to="/forms/input-groups" />
      <SidebarMenu.Item title="Cache" to="/forms/wizard" />
      <SidebarMenu.Item title="Acrs" to="/forms/text-mask" />
      <SidebarMenu.Item title="Logging" to="/forms/text-mask" />
      <SidebarMenu.Item title="Jwks" to="/forms/text-mask" />
    </SidebarMenu.Item>
    <Divider />
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-wrench"></i>}
      title="Settings"
      to="/apps/settings-edit"
    />
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-sign-out mr-2"></i>}
      title="Sign out"
      to="/pages/login"
    />
  </SidebarMenu>
);
