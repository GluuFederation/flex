import { JANS_LINK_READ, JANS_LINK_WRITE } from "Utils/PermChecker";
import JansLinkPage from "./components/CacheRefresh/JansLinkPage";
import cacheRefreshReducer from "./redux/features/CacheRefreshSlice";
import cacheRefreshSaga from "./redux/sagas/CacheRefreshSaga";

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
    }
  ],
  reducers: [{ name: 'cacheRefreshReducer', reducer: cacheRefreshReducer }],
  sagas: [cacheRefreshSaga()],
};

export default pluginMetadata;
