import React from 'react';
import { NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { withPageConfig } from './../Layout';

const SidebarTrigger = (props) => {
  const { tag: Tag, pageConfig, ...otherProps } = props;
  return (
    <Tag
      onClick={ () => { props.pageConfig.toggleSidebar(); return false; } }
      active={ Tag !== 'a' ? !pageConfig.sidebarCollapsed : undefined }
      { ...otherProps }
    >
      {pageConfig.sidebarCollapsed && <i className="fa fa-bars fa-fw fa-2x" style={{color: 'white', cursor: 'pointer'}}></i>}
      {!pageConfig.sidebarCollapsed && <i className="fa fa-times fa-fw fa-2x" style={{color: 'white', cursor: 'pointer'}}></i>}
    </Tag>
  );
};
SidebarTrigger.propTypes = {
  tag: PropTypes.any,
  children: PropTypes.node,
  pageConfig: PropTypes.object
};
SidebarTrigger.defaultProps = {
  tag: NavLink,
};

const cfgSidebarTrigger = withPageConfig(SidebarTrigger);

export {
  cfgSidebarTrigger as SidebarTrigger
};
