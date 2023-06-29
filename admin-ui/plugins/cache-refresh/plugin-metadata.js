import { CACHE_REFRESH_READ, CACHE_REFRESH_WRITE } from "../../app/utils/PermChecker";
import CacheRefreshManagement from "./components/CacheRefresh/CacheRefreshManagement";
import cacheRefreshReducer from "./redux/features/CacheRefreshSlice";
import cacheRefreshSaga from "./redux/sagas/CacheRefreshSaga";

const PLUGIN_BASE_PATH = "/cache-refresh";

const pluginMetadata = {
  menus: [
    {
      title: "menus.cacherefresh", 
      icon: "cacherefresh", 
      path: PLUGIN_BASE_PATH + '/cacherefreshmanagement',
      permission: CACHE_REFRESH_READ,
    },
  ],
  routes: [
    {
      component: CacheRefreshManagement,
      path: PLUGIN_BASE_PATH + '/cacherefreshmanagement',
      permission: CACHE_REFRESH_WRITE,
    }
  ],
  reducers: [{ name: 'cacheRefreshReducer', reducer: cacheRefreshReducer }],
  sagas: [cacheRefreshSaga()],
};

export default pluginMetadata;
