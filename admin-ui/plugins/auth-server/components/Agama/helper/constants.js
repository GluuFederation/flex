// Centralized constants for Agama Alias component
export const AGAMA_ALIAS_STRINGS = {
  fields: {
    mapping: 'Mapping',
    source: 'Source',
    columns: [
      { title: 'Mapping', field: 'mapping' },
      { title: 'Source', field: 'source' },
    ],
  },
  actions: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    add_mapping: 'Add Mapping',
  },
  titles: {
    add_alias: 'Add Alias',
    edit_alias: 'Edit Alias',
    delete_alias: 'Delete Alias',
  },
  messages: {
    delete_confirm: 'Are you sure you want to delete this alias?',
    edit_alias: 'Edit Alias',
  },
  feature: {
    delete: 'agama_alias_delete',
  },
  permissions: {
    READ: 'agama_alias_read',
    WRITE: 'agama_alias_write',
    DELETE: 'agama_alias_delete',
  },
}
