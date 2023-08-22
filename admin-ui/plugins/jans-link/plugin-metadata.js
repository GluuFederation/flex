import { JANS_LINK_READ, JANS_LINK_WRITE } from "Utils/PermChecker";
import JansLinkPage from "./components/CacheRefresh/JansLinkPage";
import cacheRefreshReducer from "./redux/features/CacheRefreshSlice";
import cacheRefreshSaga from "./redux/sagas/CacheRefreshSaga";
import SourceBackendServerForm from "./components/SourceBackendServers/SourceBackendServerForm";

const PLUGIN_BASE_PATH = "/jans-link";

const pluginMetadata = {
  menus: [
    {
      title: "menus.jans_link", 
      icon: "jans_link", 
      path: PLUGIN_BASE_PATH,
      permission: JANS_LINK_READ,
    },
  ],
  routes: [
    {
      component: JansLinkPage,
      path: PLUGIN_BASE_PATH,
      permission: JANS_LINK_WRITE,
    },
    {
      component: SourceBackendServerForm,
      path: `${PLUGIN_BASE_PATH}/source-backend-ldap-servers/edit`,
      permission: JANS_LINK_WRITE,
    },
    {
      component: SourceBackendServerForm,
      path: `${PLUGIN_BASE_PATH}/source-backend-ldap-servers/add`,
      permission: JANS_LINK_WRITE,
    },
    {
      component: JansLinkPage,
      path: `${PLUGIN_BASE_PATH}/configuration`,
      permission: JANS_LINK_WRITE,
    },
    {
      component: JansLinkPage,
      path: `${PLUGIN_BASE_PATH}/customer-backend-key-attributes`,
      permission: JANS_LINK_WRITE,
    },
    {
      component: JansLinkPage,
      path: `${PLUGIN_BASE_PATH}/source-backend-ldap-servers`,
      permission: JANS_LINK_WRITE,
    },
    {
      component: JansLinkPage,
      path: `${PLUGIN_BASE_PATH}/inum-db-server`,
      permission: JANS_LINK_WRITE,
    },
  ],
  reducers: [{ name: 'cacheRefreshReducer', reducer: cacheRefreshReducer }],
  sagas: [cacheRefreshSaga()],
};

export default pluginMetadata;
