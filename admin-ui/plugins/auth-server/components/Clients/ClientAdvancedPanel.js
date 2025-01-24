import React, { useEffect, useState } from "react";
import { Col, Container, FormGroup } from "Components";
import GluuBooleanSelectBox from "Routes/Apps/Gluu/GluuBooleanSelectBox";
import GluuLabel from "Routes/Apps/Gluu/GluuLabel";
import GluuTypeAheadForDn from "Routes/Apps/Gluu/GluuTypeAheadForDn";
import GluuToogleRow from "Routes/Apps/Gluu/GluuToogleRow";
import GluuInputRow from "Routes/Apps/Gluu/GluuInputRow";
import GluuTypeAhead from "Routes/Apps/Gluu/GluuTypeAhead";
import GluuTypeAheadWithAdd from "Routes/Apps/Gluu/GluuTypeAheadWithAdd";
import { useTranslation } from "react-i18next";
import ClientShowSpontaneousScopes from "./ClientShowSpontaneousScopes";
import GluuTooltip from "Routes/Apps/Gluu/GluuTooltip";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { set } from "lodash";
const DOC_CATEGORY = "openid_client";

function ClientAdvancedPanel({
  client,
  scripts,
  formik,
  viewOnly,
  modifiedFields,
  setModifiedFields,
}) {
  const { t } = useTranslation();
  const request_uri_id = "request_uri_id";
  const requestUris = [];

  const [expirable] = useState(
    formik.values.expirationDate ? formik.values.expirationDate : false
  );
  const [scopesModal, setScopesModal] = useState(false);
  const [expirationDate, setExpirationDate] = useState(
    expirable ? dayjs(expirable) : undefined
  );
  const handler = () => {
    setScopesModal(!scopesModal);
  };

  const filteredScripts = scripts
    ?.filter((item) => item.scriptType == "person_authentication")
    ?.filter((item) => item.enabled)
    ?.map((item) => item.name);
  function uriValidator(uri) {
    return uri;
  }
  function getMapping(partial, total) {
    if (!partial) {
      partial = [];
    }
    return total.filter((item) => partial.includes(item));
  }

  useEffect(() => {
    // Listen for changes on expirable input switch
    if (!formik.values.expirable) {
      formik.setFieldValue("expirationDate", null);
      setExpirationDate(null);
    }
  }, [formik.values.expirable]);

  return (
    <Container>
      <ClientShowSpontaneousScopes handler={handler} isOpen={scopesModal} />
      <GluuToogleRow
        name="persistClientAuthorizations"
        lsize={3}
        rsize={9}
        handler={(e) => {
          formik.setFieldValue("persistClientAuthorizations", e.target.checked);
          setModifiedFields({
            ...modifiedFields,
            "Persist Client Authorizations": e.target.checked,
          });
        }}
        label="fields.persist_client_authorizations"
        value={formik.values.persistClientAuthorizations}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuBooleanSelectBox
        name="attributes.allowSpontaneousScopes"
        label="fields.allow_spontaneous_scopes"
        value={formik.values?.attributes?.allowSpontaneousScopes}
        formik={formik}
        lsize={3}
        rsize={9}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handler={(e) => {
          setModifiedFields({
            ...modifiedFields,
            "Allow Spontaneous Scopes": e.target.value,
          });
        }}
      />
      <GluuTypeAheadForDn
        name="attributes.spontaneousScopes"
        label="fields.spontaneousScopesREGEX"
        formik={formik}
        value={formik.values?.attributes?.spontaneousScopes || []}
        options={formik.values?.attributes?.spontaneousScopes || []}
        haveLabelKey={false}
        allowNew={true}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        onChange={(selected) => {
          setModifiedFields({
            ...modifiedFields,
            "Spontaneous Scopes": selected,
          });
        }}
      ></GluuTypeAheadForDn>

      <GluuTooltip
        doc_category={DOC_CATEGORY}
        doc_entry="spontaneousScopesViewContent"
      >
        {client.inum && (
          <FormGroup row>
            <GluuLabel label="fields.spontaneousScopes" />
            <Col sm={9}>
              <a onClick={handler} className="common-link">
                View Current
              </a>
            </Col>
          </FormGroup>
        )}
      </GluuTooltip>
      <GluuInputRow
        label="fields.initiateLoginUri"
        name="initiateLoginUri"
        formik={formik}
        value={formik.values.initiateLoginUri}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            "Initiate Login Uri": e.target.value,
          });
        }}
      />
      <GluuTypeAheadWithAdd
        name="requestUris"
        label="fields.requestUris"
        formik={formik}
        placeholder={t("Enter a valid request uri eg") + " https://..."}
        value={formik.values.requestUris || []}
        options={requestUris}
        validator={uriValidator}
        inputId={request_uri_id}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        handler={(name, items) => {
          setModifiedFields({
            ...modifiedFields,
            "Request Uris": items,
          });
        }}
      ></GluuTypeAheadWithAdd>
      <GluuTypeAhead
        name="defaultAcrValues"
        label="fields.defaultAcrValues"
        formik={formik}
        value={getMapping(formik.values.defaultAcrValues, filteredScripts)}
        options={filteredScripts}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        onChange={(selected) => {
          setModifiedFields({
            ...modifiedFields,
            "Default Acr Values": selected,
          });
        }}
      ></GluuTypeAhead>
      <GluuTypeAhead
        name="attributes.authorizedAcrValues"
        label="fields.authorizedAcrValues"
        formik={formik}
        value={
          getMapping(
            formik.values?.attributes?.authorizedAcrValues || [],
            filteredScripts
          ) || []
        }
        options={filteredScripts}
        doc_category={DOC_CATEGORY}
        lsize={3}
        rsize={9}
        disabled={viewOnly}
        onChange={(selected) => {
          setModifiedFields({
            ...modifiedFields,
            "Authorized Acr Values": selected,
          });
        }}
      ></GluuTypeAhead>
      <GluuToogleRow
        name="attributes.jansDefaultPromptLogin"
        lsize={3}
        rsize={9}
        label="fields.defaultPromptLogin"
        value={formik.values.attributes.jansDefaultPromptLogin}
        handler={(e) => {
          formik.setFieldValue(
            "attributes.jansDefaultPromptLogin",
            e.target.checked
          );
          setModifiedFields({
            ...modifiedFields,
            "Default Prompt Login": e.target.checked,
          });
        }}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
      />
      <GluuInputRow
        label="fields.tls_client_auth_subject_dn"
        name="attributes.tlsClientAuthSubjectDn"
        formik={formik}
        value={formik.values?.attributes?.tlsClientAuthSubjectDn}
        doc_category={DOC_CATEGORY}
        disabled={viewOnly}
        handleChange={(e) => {
          setModifiedFields({
            ...modifiedFields,
            "TLS Client Auth Subject Dn": e.target.value,
          });
        }}
      />

      <FormGroup row>
        <Col sm={6}>
          <GluuToogleRow
            name="expirable"
            formik={formik}
            label="fields.is_expirable_client"
            value={formik.values.expirable}
            doc_category={DOC_CATEGORY}
            lsize={6}
            rsize={6}
            disabled={viewOnly}
            onChange={(e) => {
              setModifiedFields({
                ...modifiedFields,
                "Is Expirable Client": e.target.checked,
              });
            }}
          />
        </Col>
        <Col sm={6}>
          {formik.values.expirable ? (
            <FormGroup row>
              <Col sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    id="expirationDate"
                    name="expirationDate"
                    disablePast
                    value={expirationDate}
                    onChange={(date) => {
                      formik.setFieldValue("expirationDate", new Date(date));
                      setExpirationDate(date);
                      setModifiedFields({
                        ...modifiedFields,
                        "Expiration Date": new Date(date).toDateString(),
                      })
                    }}
                  />
                </LocalizationProvider>
              </Col>
            </FormGroup>
          ) : null}
        </Col>
      </FormGroup>
    </Container>
  );
}

export default ClientAdvancedPanel;
ClientAdvancedPanel.propTypes = {
  formik: PropTypes.any,
  client: PropTypes.any,
  scripts: PropTypes.any,
  viewOnly: PropTypes.bool,
  modifiedFields: PropTypes.any,
  setModifiedFields: PropTypes.func,
};
