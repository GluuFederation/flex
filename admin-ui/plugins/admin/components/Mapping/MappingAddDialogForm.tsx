import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
} from '@mui/material'
import { Close, AddCircleOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { TypeaheadRef } from 'react-bootstrap-typeahead'
import GluuSingleValueCompleter from '../../../../app/routes/Apps/Gluu/GluuSingleValueCompleter'
import GluuTypeAhead from '../../../../app/routes/Apps/Gluu/GluuTypeAhead'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { MappingAddDialogFormProps, ThemeContextValue } from './types'

type Option = string | Record<string, unknown>

const DOC_CATEGORY = 'role_permission_mapping'

const MappingAddDialogForm: React.FC<MappingAddDialogFormProps> = ({
  handler,
  modal,
  onAccept,
  roles,
  permissions,
  mapping = [],
}) => {
  const [autoCompleteRoles, setAutoCompleteRoles] = useState<string[]>([])
  const [searchablePermissions, setSearchAblePermissions] = useState<string[]>([])
  const [apiRole, setApiRole] = useState<string>('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const autocompleteRef = useRef<TypeaheadRef>(null)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeContextValue | undefined
  const selectedTheme = theme?.state?.theme ?? 'default'
  const themeColors = getThemeColor(selectedTheme)

  const isAddEnabled = Boolean(apiRole && selectedPermissions.length)

  useEffect(() => {
    if (!modal) {
      setApiRole('')
      setSelectedPermissions([])
    }
  }, [modal])

  const getPermissionsForSearch = useCallback(
    (role: string = '') => {
      const fullPermissions: string[] = []
      for (const p of permissions) {
        if (p?.permission) {
          fullPermissions.push(p.permission as string)
        }
      }
      if (role) {
        const roleMapping = (mapping || []).find((m) => m?.role === role)
        const assigned = new Set(roleMapping?.permissions || [])
        const filtered = fullPermissions.filter((p) => !assigned.has(p))
        setSearchAblePermissions(filtered)
        return
      }
      setSearchAblePermissions(fullPermissions)
    },
    [permissions, mapping],
  )

  useEffect(() => {
    getPermissionsForSearch(apiRole)
  }, [apiRole, getPermissionsForSearch])

  useEffect(() => {
    const rolesArr = roles.filter((r) => r?.role).map((r) => r.role as string)
    setAutoCompleteRoles(rolesArr)
  }, [roles])

  function handleAccept() {
    const roleData = {
      role: apiRole,
      permissions: selectedPermissions,
    }
    onAccept(roleData)
  }

  return (
    <Dialog
      open={modal}
      onClose={handler}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AddCircleOutline sx={{ color: themeColors?.background, fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('messages.new_role')}
          </Typography>
        </Box>
        <IconButton onClick={handler} size="small" sx={{ color: 'text.secondary' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('messages.adding_new_permission')}
        </Typography>

        <Stack spacing={3}>
          <Box>
            <GluuSingleValueCompleter
              name="api_role"
              label="fields.role"
              options={autoCompleteRoles}
              value={apiRole ? [apiRole] : []}
              hideHelperMessage
              onChange={(selected: string[]) => {
                const role = selected.length ? selected[0] : ''
                setApiRole(role)
                setSelectedPermissions([])
              }}
              doc_category={DOC_CATEGORY}
            />
          </Box>

          <Box>
            <GluuTypeAhead
              name="addMappingRolePermissions"
              label="fields.permissions"
              onChange={(selected: Option[]) => {
                setSelectedPermissions(selected.filter((s): s is string => typeof s === 'string'))
              }}
              options={searchablePermissions}
              allowNew={false}
              value={selectedPermissions}
              required={false}
              forwardRef={autocompleteRef}
              doc_category={DOC_CATEGORY}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1,
        }}
      >
        <Button
          onClick={handler}
          variant="outlined"
          sx={{
            'borderColor': themeColors?.background,
            'color': themeColors?.background,
            '&:hover': {
              borderColor: themeColors?.background,
              backgroundColor: 'action.hover',
            },
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          disabled={!isAddEnabled}
          startIcon={<AddCircleOutline />}
          sx={{
            'backgroundColor': themeColors?.background,
            '&:hover': {
              backgroundColor: themeColors?.background,
              opacity: 0.9,
            },
            '&.Mui-disabled': {
              backgroundColor: 'action.disabledBackground',
            },
          }}
        >
          {t('actions.add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MappingAddDialogForm
