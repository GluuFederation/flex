import React from "react";

import { SidebarMenu } from "./../../components";

export const SidebarMiddleNav = () => (
  <SidebarMenu>
    <SidebarMenu.Item icon={<i className="fa fa-fw fa-home"></i>} title="Home">
      <SidebarMenu.Item title="Analytics" to="/home/analytics" exact />
      <SidebarMenu.Item title="Reports" to="/home/reports" exact />
    </SidebarMenu.Item>
    {/* -------- Cards ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-clone"></i>}
      title="Attributes"
    >
      <SidebarMenu.Item title="Cards" to="/cards/cards" exact />
      <SidebarMenu.Item title="Cards Headers" to="/cards/cardsheaders" exact />
    </SidebarMenu.Item>
    {/* -------- Layouts ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-columns"></i>}
      title="Clients"
    >
      <SidebarMenu.Item title="Navbar" to="/layouts/navbar" exact />
      <SidebarMenu.Item title="Sidebar" to="/layouts/sidebar" exact />
      <SidebarMenu.Item title="Sidebar A" to="/layouts/sidebar-a" exact />
    </SidebarMenu.Item>
    {/* -------- Interface ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-toggle-on"></i>}
      title="Scopes"
    >
      <SidebarMenu.Item title="Breadcrumbs" to="/interface/breadcrumbs" />
      <SidebarMenu.Item title="Navbars" to="/interface/navbars" />
      <SidebarMenu.Item title="Notifications" to="/interface/notifications" />
      <SidebarMenu.Item title="Crop Image" to="/interface/crop-image" />
    </SidebarMenu.Item>
    {/* -------- Forms ---------*/}
    <SidebarMenu.Item
      icon={<i className="fa fa-fw fa-check-square-o"></i>}
      title="Configuration"
    >
      <SidebarMenu.Item title="Forms" to="/forms/forms" />
      <SidebarMenu.Item title="Forms Layouts" to="/forms/forms-layouts" />
      <SidebarMenu.Item title="Input Groups" to="/forms/input-groups" />
      <SidebarMenu.Item title="Wizard" to="/forms/wizard" />
      <SidebarMenu.Item title="Text Mask" to="/forms/text-mask" />
    </SidebarMenu.Item>
  </SidebarMenu>
);
