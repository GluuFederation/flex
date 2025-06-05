import React, { useState, useEffect, useContext, useMemo } from "react";
import { SidebarMenu, SidebarMenuItem } from "Components";
import { useSelector } from "react-redux";
import { hasPermission } from "Utils/PermChecker";
import { ErrorBoundary } from "react-error-boundary";
import GluuErrorFallBack from "./GluuErrorFallBack";
import { processMenus } from "Plugins/PluginMenuResolver";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "Context/theme/themeContext";
import getThemeColor from "Context/theme/config";
import CachedIcon from "@mui/icons-material/Cached";
import LockIcon from "@mui/icons-material/Lock";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import styles from "./styles/GluuAppSidebar.style";
import { MenuContext } from "../../../components/SidebarMenu/MenuContext";
import {
  WaveIcon,
  HomeIcon,
  OAuthIcon,
  UserClaimsIcon,
  ServicesIcon,
  UsersIcon,
  FidoIcon,
  ScimIcon,
  SamlIcon,
  JansKcLinkIcon,
  StmpZoneIcon,
} from "../../../components/SVG";

// Type definitions
interface MenuItem {
  icon?: string;
  path?: string;
  title?: string;
  permission?: string;
  children?: MenuItem[];
}

interface PluginMenu extends MenuItem {}

interface RootState {
  authReducer: {
    token?: {
      scopes: string[];
    };
    permissions?: string[];
  };
  healthReducer: {
    health: Record<string, string>;
  };
  userReducer: {
    isUserLogout: boolean;
  };
}

function GluuAppSidebar() {
  const scopes = useSelector((state: RootState) =>
    state.authReducer.token
      ? state.authReducer.token.scopes
      : state.authReducer.permissions
  );
  const health = useSelector((state: RootState) => state.healthReducer.health);
  const { isUserLogout } = useSelector((state: RootState) => state.userReducer);
  const [pluginMenus, setPluginMenus] = useState<PluginMenu[]>([]);
  const { t } = useTranslation();
  const theme = useContext(ThemeContext) as { state: { theme: string } };
  const selectedTheme = theme.state.theme;
  const sidebarMenuActiveClass = `sidebar-menu-active-${selectedTheme}`;
  const { classes } = styles();
  const themeColors = getThemeColor(selectedTheme);
  const navigate = useNavigate();

  const fetchedServersLength = useMemo(
    () => Object.keys(health).length > 0,
    [health]
  );

  useEffect(() => {
    const menus: PluginMenu[] = processMenus();

    if (fetchedServersLength) {
      const visibilityConditions: Record<string, string> = {
        "/jans-lock": "jans-lock",
        "/fido/fidomanagement": "jans-fido2",
        "/scim": "jans-scim",
      };

      const filtered = menus.filter((menu: PluginMenu) => {
        const healthKey = visibilityConditions[menu.path || ""];
        if (healthKey) {
          return health?.[healthKey] === "Running";
        }
        return true;
      });

      setPluginMenus(filtered);
    }
  }, [health, fetchedServersLength]);

  useEffect(() => {
    if (isUserLogout) {
      navigate("/logout");
    }
  }, [isUserLogout, navigate]);

  function getMenuIcon(name?: string): React.ReactNode {
    switch (name) {
      case "home":
        return <HomeIcon className="menu-icon" />;
      case "oauthserver":
        return <OAuthIcon className="menu-icon" />;
      case "services":
        return <ServicesIcon className="menu-icon" />;
      case "user_claims":
        return <UserClaimsIcon className="menu-icon" />;
      case "scripts":
        return (
          <i
            className="menu-icon fas fa-file-code"
            style={{ fontSize: "28px" }}
          />
        );
      case "usersmanagement":
        return <UsersIcon className="menu-icon" />;
      case "stmpmanagement":
        return <StmpZoneIcon className="menu-icon" />;
      case "fidomanagement":
        return <FidoIcon className="menu-icon" />;
      case "scim":
        return <ScimIcon className="menu-icon" />;
      case "jans_link":
        return (
          <CachedIcon
            className="menu-icon"
            style={{ top: "-2px", height: "28px", width: "28px" }}
          />
        );
      case "jans_lock":
        return (
          <LockIcon
            className="menu-icon"
            style={{ top: "-2px", height: "28px", width: "28px" }}
          />
        );
      case "jans_kc_link":
        return (
          <JansKcLinkIcon
            className="menu-icon"
            style={{ top: "-2px", height: "28px", width: "28px" }}
          />
        );
      case "saml":
        return (
          <SamlIcon
            className="menu-icon"
            style={{ top: 0, height: "28px", width: "28px" }}
          />
        );
      default:
        return null;
    }
  }

  function getMenuPath(menu: MenuItem): string | undefined {
    if (menu.children) {
      return undefined;
    }
    return menu.path ?? undefined;
  }

  function hasChildren(plugin: MenuItem): boolean {
    return typeof plugin.children !== "undefined" && plugin.children.length > 0;
  }

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <SidebarMenu>
        {fetchedServersLength ? (
          <MenuContext.Consumer>
            {(ctx: any) =>
              pluginMenus.map((plugin, key) => (
                <SidebarMenuItem
                  key={key}
                  icon={getMenuIcon(plugin.icon)}
                  to={getMenuPath(plugin)}
                  title={t(`${plugin.title}`)}
                  textStyle={{ fontSize: "18px" }}
                  sidebarMenuActiveClass={sidebarMenuActiveClass}
                  {...ctx}
                >
                  {hasChildren(plugin) &&
                    plugin.children!.map((item, idx) => (
                      <SidebarMenuItem
                        key={idx}
                        title={t(`${item.title}`)}
                        isEmptyNode={
                          !hasPermission(scopes, item.permission) &&
                          !hasChildren(item)
                        }
                        to={getMenuPath(item)}
                        icon={getMenuIcon(item.icon)}
                        textStyle={{ fontSize: "15px" }}
                        exact
                        {...ctx}
                      >
                        {hasChildren(item) &&
                          item.children!.map((sub, id) => (
                            <SidebarMenuItem
                              key={id}
                              title={t(`${sub.title}`)}
                              to={getMenuPath(sub)}
                              isEmptyNode={
                                !hasPermission(scopes, sub.permission)
                              }
                              icon={getMenuIcon(sub.icon)}
                              textStyle={{ fontSize: "15px" }}
                              exact
                              {...ctx}
                            ></SidebarMenuItem>
                          ))}
                      </SidebarMenuItem>
                    ))}
                </SidebarMenuItem>
              ))
            }
          </MenuContext.Consumer>
        ) : (
          <div style={{ marginTop: "20vh" }}>
            <GluuLoader blocking={!fetchedServersLength} />
          </div>
        )}

        <div
          className={
            fetchedServersLength
              ? classes.waveContainer
              : classes.waveContainerFixed
          }
        >
          <WaveIcon
            className={classes.wave}
            fill={themeColors.menu.background}
          />
          <div className={classes.powered}>Powered by Gluu</div>
        </div>
      </SidebarMenu>
    </ErrorBoundary>
  );
}

export default GluuAppSidebar;
