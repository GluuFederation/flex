// @ts-nocheck
import React, { useCallback, useState } from "react";
import { FormGroup, Col } from "Components";
import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead";
import GluuLabel from "../Gluu/GluuLabel";
import GluuTooltip from "./GluuTooltip";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import _debounce from "lodash/debounce";

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
});

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
  paginate = false,
  onSearch = () => {},
  onPaginate = () => {},
  maxResults = undefined,
  isLoading = false,
  placeholder = undefined,
  onChange,
  hideHelperMessage,
  defaultSelected = [],
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const getItemName = useCallback((open) => {
    const data = theOptions?.filter(
      (e) => e.dn === item || item.includes(e.key)
    );
    return data[0]?.name;
  }, []);

  const getKey = useCallback((option) => {
    return `(Claim name: ${option.key})`;
  }, []);

  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        required={required}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
      />
      <Col sm={rsize}>
        <AsyncTypeahead
          isLoading={isLoading}
          labelKey={
            haveLabelKey
              ? (opt) =>
                  `${opt.name || getItemName(options, opt)} ${
                    opt.key ? getKey(opt) : ""
                  }`
              : null
          }
          maxResults={maxResults}
          options={options}
          onPaginate={onPaginate}
          paginate={paginate}
          placeholder={placeholder}
          renderMenuItemChildren={(option) => {
            return (
              <div key={option.name}>
                <span>{option.name}</span>
              </div>
            );
          }}
          open={open}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onChange={(selected) => {
            formik.setFieldValue(
              name,
              selected.map((item) =>
                typeof item == "string"
                  ? item
                  : item.customOption
                  ? item.label
                  : item.dn
              )
            );
            onChange?.(selected);
          }}
          disabled={disabled}
          id={name}
          data-testid={name}
          useCache={false}
          allowNew={allowNew}
          multiple={true}
          selected={defaultSelected}
          onSearch={onSearch}
        />
        {!hideHelperMessage && (
          <ThemeProvider theme={theme}>
            <Typography variant="subtitle1">
              {t("placeholders.typeahead_holder_message")}
            </Typography>
          </ThemeProvider>
        )}
      </Col>
    </FormGroup>
  );
}

export default GluuTypeAheadForDn;
