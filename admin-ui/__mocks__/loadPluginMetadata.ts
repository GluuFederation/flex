export const loadPluginMetadata = () => ({
  default: {
    menus: [],
    routes: [],
    reducers: [],
    listeners: [],
  },
})

// The real module also exports an async variant, which PluginMenuResolver calls. The mapper regex
// catches the re-export in plugins/internal, so omitting it here leaves that name re-exported as
// undefined.
export const loadPluginMetadataAsync = async () => loadPluginMetadata()
