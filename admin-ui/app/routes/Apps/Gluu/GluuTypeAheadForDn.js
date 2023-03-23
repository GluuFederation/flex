import React, { useCallback, useEffect, useState } from 'react'
import { FormGroup, Col } from 'Components'
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTooltip from './GluuTooltip'
import Typography from '@material-ui/core/Typography'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { getScopes } from 'Plugins/auth-server/redux/actions/ScopeActions'
import { useSelector, useDispatch } from 'react-redux'
import _debounce from 'lodash/debounce';
import { isEmpty } from 'lodash'
import { PER_PAGE_SCOPES } from '../../../../plugins/auth-server/common/Constants'

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
})

const userAction = {
  limit: PER_PAGE_SCOPES
}

function GluuTypeAheadForDn({
  label,
  name,
  value,
  options,
  formik,
  required,
  doc_category,
  doc_entry,
  disabled = false,
  allowNew = false,
  haveLabelKey = true,
  lsize = 4,
  rsize = 8,
}) {
  const dispatch = useDispatch()
  const totalItems = useSelector((state) => state.scopeReducer.totalItems)
  const isLoading = useSelector((state) => state.scopeReducer.loading)
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [paginate, setPaginate] = useState(true)

  const getItemName = useCallback((theOptions, item) => {
    const data = theOptions.filter((e) => e.dn === item)
    return data[0].name
  }, [])

  useEffect(() => {
    if (totalItems < userAction.limit) {
      setPaginate(false)
    }
  }, [totalItems, userAction.limit])

  const handlePagination = async (event, shownResults) => {
    if (totalItems + PER_PAGE_SCOPES > userAction.limit) {
      userAction['limit'] += PER_PAGE_SCOPES
      dispatch(getScopes(userAction))
    }
  };

  const debounceFn = useCallback(_debounce((query) => {
    const searchedScope = options.find((scope) => scope.name.includes(query))
    if (isEmpty(searchedScope)) {
      query && handleDebounceFn()
    }
  }, 1000), [options])

  function handleDebounceFn(inputValue) {
    userAction['limit'] += PER_PAGE_SCOPES
    if (totalItems + PER_PAGE_SCOPES > userAction.limit) {
      dispatch(getScopes(userAction))
    }
  }

  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} required={required} doc_category={doc_category} doc_entry={doc_entry || name} />
      <Col sm={rsize}>
        <AsyncTypeahead
          isLoading={isLoading}
          labelKey={
            haveLabelKey
              ? (opt) => `${opt.name || getItemName(options, opt)}`
              : null
          }
          maxResults={PER_PAGE_SCOPES - 1}
          options={options}
          onPaginate={handlePagination}
          onSearch={debounceFn}
          paginate={paginate}
          placeholder="Search for a scope..."
          renderMenuItemChildren={(option) => {
            return (
              <div key={option.name}>
                <span>{option.name}</span>
              </div>
            )
          }}
          open={open}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onChange={(selected) => {
            formik.setFieldValue(
              name,
              selected.map((item) =>
                typeof item == 'string'
                  ? item
                  : item.customOption
                    ? item.label
                    : item.dn,
              ),
            )
          }}
          disabled={disabled}
          id={name}
          data-testid={name}
          useCache={false}
          allowNew={allowNew}
          multiple={true}
          defaultSelected={value}
        />
        <ThemeProvider theme={theme}>
          <Typography variant="subtitle1">
            {t('placeholders.typeahead_holder_message')}
          </Typography>
        </ThemeProvider>
      </Col>
    </FormGroup>
  )
}

export default GluuTypeAheadForDn