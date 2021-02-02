import React from "react";
import items from "../../menu/items";

import { SidebarMenu, Divider } from "./../../components";

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
      <SidebarMenu.Item title="All Attributes" to="/attributes" exact />
      <SidebarMenu.Item title="New Attribute" to="/attribute/new" exact />
    </SidebarMenu.Item>
    {/* -------- OIDC ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-cubes"></i>}
      title="Clients"
    >
      <SidebarMenu.Item title="All Clients" to="/clients" exact />
      <SidebarMenu.Item title="New Client" to="/client/new" exact />
    </SidebarMenu.Item>
    {/* -------- Scopes ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-sitemap"></i>}
      title="Scopes"
    >
      <SidebarMenu.Item title="All Scopes" to="/scopes" />
      <SidebarMenu.Item title="New Scope" to="/scope/new" />
    </SidebarMenu.Item>
    {/* -------- Custom scripts ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-puzzle-piece"></i>}
      title="Custom Scripts"
    >
      <SidebarMenu.Item title="All Scripts" to="/scripts" exact />
      <SidebarMenu.Item title="New Script" to="/script/new" exact />
    </SidebarMenu.Item>
    {/* -------- Scopes ---------*/}
    {/* -------- Plugins ---------*/}
    {items.map((item, key) => (
      <SidebarMenu.Item key={key} title={item.title}></SidebarMenu.Item>
    ))}
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
      to="/pages/logout"
    />
  </SidebarMenu>
);
