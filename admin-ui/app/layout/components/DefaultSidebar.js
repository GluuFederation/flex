import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarTrigger, Divider } from './../../components';
import { LogoThemed } from '../../routes/components/LogoThemed/LogoThemed';
import GluuAppSidebar from '../../routes/Apps/Gluu/GluuAppSidebar';

export const DefaultSidebar = () => (
  <Sidebar>
    {/* START SIDEBAR-OVERLAY: Close (x) */}
    <Sidebar.Close>
      <SidebarTrigger tag={'a'} href="#">
        <i className="fa fa-times-circle fa-fw"></i>
      </SidebarTrigger>
    </Sidebar.Close>
    {/* START SIDEBAR-OVERLAY: Close (x) */}

    {/* START SIDEBAR: Only for Desktop */}
    <Sidebar.HideSlim>
      <Sidebar.Section>
        <div style={{ textAlign: 'center' }}>
          <SidebarTrigger id="navToggleBtn" color={'#8492a5'} />
        </div>
        <Link to="/" className="sidebar__brand">
          <LogoThemed checkBackground />
        </Link>
      </Sidebar.Section>
      <Divider />
      <Divider />
    </Sidebar.HideSlim>
    {/* END SIDEBAR: Only for Desktop */}

    {/* START SIDEBAR: Only for Mobile */}
    <Sidebar.MobileFluid>
      {/* <SidebarTopA /> */}
      <Sidebar.Section fluid cover>
        <SidebarTrigger
          id="navToggleBtn"
          color={'#8492a5'}
          showCollapseonly={true}
        />
        {/* SIDEBAR: Menu */}
        <GluuAppSidebar />
      </Sidebar.Section>
    </Sidebar.MobileFluid>
    {/* END SIDEBAR: Only for Mobile */}
  </Sidebar>
);
