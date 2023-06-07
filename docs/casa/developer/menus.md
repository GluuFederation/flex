# Working with Menus

!!! Note
    It is highly recommended you follow the [Writing your first plugin](writing-first.md) guide before reading this contents.
    
## Overview

In the introductory pages, we mentioned that developers can customize three types of menus: user, admin, and drop down. This can be achieved by implementing the `org.gluu.casa.extension.navigation.NavigationMenu` extension point.

Every extension point you implement specifies which type of menu item is intended by supplying a return value for the `menuType` method. Valid return values are `MenuType.USER`, `MenuType.ADMIN_CONSOLE`, or `MenuType.AUXILIARY`.

The `getContentsUrl` method references a path to a page that can contain markup of any kind. This markup will be evaluated and added to the corresponding menu. The path is relative to the `assets` directory of your plugin.

Remember that all menu items are added after Casa defaults. For example, if you are targeting user menus, the 2FA menu and password reset will be shown first, and those dynamically added come afterwards.

Since plugins can have several extensions, and several plugins can be added to a Casa installation, there needed to be a way to organize the order of menu items contributed by plugins. For this, the `getPriority` method is used: every `NavigationMenu` extension should return a number between 0 and 1 for it. The higher the value, the higher position this menu's contents will occupy in the overall menu.

This strategy allows developers to place their menu items in a specific position if they know the priority of existing menu items. For this reason, it is **highly** recommended to include somewhere in your markup the priority of the items you are adding. To avoid putting in hardcoded values, you can use the `priority` parameter, which is passed to your zul files when they contain menu-ish markup. 

As an example, in the menu item added in the [HelloWorld](writing-first.md#menuzul) plugin, you can use something like:

```
<a class="..." href="..." data-priority="${priority}">
	...
</a>
```

so that others know what the priority of your markup is upon code inspection. This allows other developers to choose suitable priority values for use in `getPriority`.

## Markup that should be used

While you can point in your menu extension to a zul page containing basically anything, you should be careful with the code supplied. The following are some tips:

- To preserve a consistent look and feel, you should use similar markup as in default Casa menu items. If possible, inspect the zul code used to generate such markup, not the one appearing in the browser because it can be more verbose than needed. The following is a list of files you may like peeking at (these are from [Casa war contents](writing-first.md#extract-war-contents) itself):

   - `app/src/main/webapp/menubuttons.zul` for regular users menu
   - `app/src/main/webapp/admin/menu.zul` for admin dashboard menu
   - `app/src/main/webapp/header.zul` for dropdown (top-right) menu
   
- Try using simple static markup for menu items. Avoid using long expressions or complex logic to generate markup. Since every page loaded involves evaluating your zul code, it is desirable to keep it lightweight.

- Ensure your zul content won't end up in a runtime evaluation error under any circumstance. If this happens, the extension will simply not contribute to the resulting markup of the page. This applies for admin, user, and drop-down menus.
