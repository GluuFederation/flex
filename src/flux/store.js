import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems()
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.toggleSidebarDropdown = this.toggleSidebarDropdown.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      case Constants.TOGGLE_SIDEBAR_DROPDOWN:
        this.toggleSidebarDropdown(payload);
        break;
      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  toggleSidebarDropdown(item) {
    const newStore = { ..._store };

    let navGroupIdx = null;
    let navItemIdx = null;

    newStore.navItems.forEach((navItem, _idx) => {
      const __idx = navItem.items.indexOf(item);
      if (__idx !== -1) {
        navGroupIdx = _idx;
        navItemIdx = __idx;
      }
    });

    newStore.navItems[navGroupIdx].items[navItemIdx].open = !newStore.navItems[
      navGroupIdx
    ].items[navItemIdx].open;

    newStore.navItems = newStore.navItems.map(i => {
      i.items = i.items.map((_i, idx) => {
        if (idx !== navItemIdx) {
          _i.open = false;
        }
        return _i;
      });
      return i;
    });

    _store = newStore;
    this.emit(Constants.CHANGE);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}

export default new Store();
