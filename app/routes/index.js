import React from "react";
import { Route, Switch, Redirect } from "react-router";

// ----------- Pages Imports ---------------
//import Analytics from "./Dashboards/Analytics";
import Reports from "./Dashboards/Reports";

import NavbarOnly from "./Layouts/NavbarOnly";
import SidebarDefault from "./Layouts/SidebarDefault";
import SidebarA from "./Layouts/SidebarA";
import DragAndDropLayout from "./Layouts/DragAndDropLayout";
import SidebarWithNavbar from "./Layouts/SidebarWithNavbar";

import AttributeListPage from "./Apps/Attibutes/AttributeListPage";
import AttributeAddPage from "./Apps/Attibutes/AttributeAddPage";
import AttributeEditPage from "./Apps/Attibutes/AttributeEditPage";

import Clients from "./Apps/Clients";
import ProfileDetails from "./Apps/ProfileDetails";
import ProfileEdit from "./Apps/ProfileEdit";

import ComingSoon from "./Pages/ComingSoon";
import Confirmation from "./Pages/Confirmation";
import Danger from "./Pages/Danger";
import Error404 from "./Pages/Error404";
import ForgotPassword from "./Pages/ForgotPassword";
import LockScreen from "./Pages/LockScreen";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Success from "./Pages/Success";
import Timeline from "./Pages/Timeline";
// ----------- Layout Imports ---------------
import { GluuNavBar } from "../routes/components/Navbars/GluuNavBar";
import { DefaultSidebar } from "./../layout/components/DefaultSidebar";
import { SidebarASidebar } from "./../layout/components/SidebarASidebar";

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
  return (
    <Switch>
      <Redirect from="/" to="/home/reports" exact />
      {/*<Route path="/home/analytics" exact component={ Analytics } />*/}
      <Route path="/home/reports" exact component={Reports} />

      {/*    Layouts     */}
      <Route path="/layouts/navbar" component={NavbarOnly} />
      <Route path="/layouts/sidebar" component={SidebarDefault} />
      <Route path="/layouts/sidebar-a" component={SidebarA} />
      <Route
        path="/layouts/sidebar-with-navbar"
        component={SidebarWithNavbar}
      />
      <Route path="/layouts/dnd-layout" component={DragAndDropLayout} />

      {/*    Apps Routes     */}

      <Route component={AttributeListPage} path="/attributes" />
      <Route component={AttributeAddPage} path="/attribute/new" />
      <Route component={AttributeEditPage} path="/attribute/edit" />

      <Route component={Clients} path="/apps/clients" />
      <Route component={ProfileDetails} path="/apps/profile-details" />
      <Route component={ProfileEdit} path="/apps/profile-edit" />

      {/*    Pages Routes    */}
      <Route component={ComingSoon} path="/pages/coming-soon" />
      <Route component={Confirmation} path="/pages/confirmation" />
      <Route component={Danger} path="/pages/danger" />
      <Route component={Error404} path="/pages/error-404" />
      <Route component={ForgotPassword} path="/pages/forgot-password" />
      <Route component={LockScreen} path="/pages/lock-screen" />
      <Route component={Login} path="/pages/login" />
      <Route component={Register} path="/pages/register" />
      <Route component={Success} path="/pages/success" />
      <Route component={Timeline} path="/pages/timeline" />
      {/*    404    */}
      <Redirect to="/pages/error-404" />
    </Switch>
  );
};

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Switch>
    {/* Default Navbar: */}
    <Route
      component={() => (
        <GluuNavBar themeStyle="color" themeColor="primary" navStyle="accent" />
      )}
    />
  </Switch>
);

export const RoutedSidebars = () => (
  <Switch>
    {/* Other Sidebars: */}
    <Route component={SidebarASidebar} path="/layouts/sidebar-a" />
    <Route
      component={SidebarWithNavbar.Sidebar}
      path="/layouts/sidebar-with-navbar"
    />
    {/* Default Sidebar: */}
    <Route component={DefaultSidebar} />
  </Switch>
);
