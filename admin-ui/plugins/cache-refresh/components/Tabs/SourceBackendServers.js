import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../../app/context/theme/themeContext";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { Row, Col, Form, FormGroup } from "../../../../app/components";
import { Button } from "Components";
import GluuProperties from "Routes/Apps/Gluu/GluuProperties";
import GluuLabel from "Routes/Apps/Gluu/GluuLabel";
import GluuInputRow from "Routes/Apps/Gluu/GluuInputRow";
import { Box } from "@mui/material";
import BindPasswordModal from "../CacheRefreshManagement/BindPasswordModal";
import GluuCheckBoxRow from "Routes/Apps/Gluu/GluuCheckBoxRow";
import * as Yup from "yup";
import GluuCommitFooter from "Routes/Apps/Gluu/GluuCommitFooter";
import { isEmpty } from "lodash";
import { putCacheRefreshConfiguration } from "../../redux/features/CacheRefreshSlice";
import { useTranslation } from "react-i18next";

const isStringsArray = (arr) => arr.every((i) => typeof i === "string");
const convertToStringArray = (arr) => {
  return arr.map((item) => item.value);
};

const SourceBackendServers = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const dispatch = useDispatch();
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  );
  const { targetConfig } = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  );
  const [addSourceLdapServer, setAddSourceLdapServer] = useState(
    targetConfig?.enabled || false
  );

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const initialValues = {
    targetConfig: {
      ...targetConfig,
      servers: targetConfig?.servers || [],
      baseDNs: targetConfig?.baseDNs || [],
      bindPassword: targetConfig?.bindPassword || null,
    },
  };

  const validationSchema = Yup.object({
    targetConfig: Yup.object().shape({
      configId: Yup.string().required(
        `${t("fields.name")} ${t("messages.is_required")}`
      ),
      bindDN: Yup.string().required(
        `${t("fields.bind_dn")} ${t("messages.is_required")}`
      ),
      maxConnections: Yup.string().required(
        `${t("fields.max_connections")} ${t("messages.is_required")}`
      ),
      servers: Yup.array().min(
        1,
        `${t("fields.server_port")} ${t("messages.is_required")}`
      ),
      baseDNs: Yup.array().min(
        1,
        `${t("fields.base_dns")} ${t("messages.is_required")}`
      ),
    }),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: addSourceLdapServer && validationSchema,
    setFieldValue: (field) => {
      delete values[field];
    },
    onSubmit: (data) => {
      if (isEmpty(formik.errors)) {
        dispatch(
          putCacheRefreshConfiguration({
            cacheRefreshConfiguration: {
              ...cacheRefreshConfiguration,
              targetConfig: {
                ...data.targetConfig,
                baseDNs: isStringsArray(data.targetConfig.baseDNs || [])
                  ? data.targetConfig.baseDNs
                  : convertToStringArray(data?.targetConfig.baseDNs || []),
                servers: isStringsArray(data.targetConfig.servers || [])
                  ? data.targetConfig.servers
                  : convertToStringArray(data?.targetConfig.servers || []),
              },
            },
          })
        );
      }
    },
  });

  const handleRemoveServer = () => {
    setAddSourceLdapServer(false);
    formik.setFieldValue("targetConfig.enabled", false);
  };

  const handleAddServer = () => {
    formik.setFieldValue("targetConfig.enabled", true);
    setAddSourceLdapServer(true);
  };

  const handleChangePassword = (updatedPassword) => {
    dispatch(
      putCacheRefreshConfiguration({
        cacheRefreshConfiguration: {
          ...cacheRefreshConfiguration,
          targetConfig: {
            ...formik.values.targetConfig,
            bindPassword: updatedPassword,
          },
        },
      })
    );
  };

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
        className="mt-4"
      >
        <FormGroup row>
          <Box className="mb-3" display="flex">
            {!addSourceLdapServer && (
              <Button onClick={handleAddServer}>
                {t("actions.add_source_ldap_server")}
              </Button>
            )}
            {addSourceLdapServer && (
              <Button color="danger" onClick={handleRemoveServer}>
                <i className="fa fa-remove me-2"></i>
                {t("actions.remove_source_server")}
              </Button>
            )}
          </Box>
          {addSourceLdapServer && (
            <>
              <Col sm={8}>
                <GluuInputRow
                  label="fields.name"
                  name="targetConfig.configId"
                  value={formik.values.targetConfig?.configId || ""}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  required
                  showError={
                    formik.errors.targetConfig?.configId ? true : false
                  }
                  errorMessage={formik.errors.targetConfig?.configId}
                />
              </Col>
              <Col sm={8}>
                <GluuInputRow
                  label="fields.bind_dn"
                  name="targetConfig.bindDN"
                  value={formik.values.targetConfig?.bindDN || ""}
                  formik={formik}
                  lsize={4}
                  rsize={8}
                  required
                  showError={formik.errors.targetConfig?.bindDN ? true : false}
                  errorMessage={formik.errors.targetConfig?.bindDN}
                />
              </Col>
              <Col sm={8}>
                <GluuInputRow
                  label="fields.max_connections"
                  name="targetConfig.maxConnections"
                  value={formik.values.targetConfig?.maxConnections || ""}
                  formik={formik}
                  type="number"
                  lsize={4}
                  rsize={8}
                  required
                  showError={
                    formik.errors.targetConfig?.maxConnections ? true : false
                  }
                  errorMessage={formik.errors.targetConfig?.maxConnections}
                />
              </Col>
              <Col sm={8}>
                <Row>
                  <GluuLabel required label="fields.server_port" size={4} />
                  <Col sm={8}>
                    <GluuProperties
                      compName="targetConfig.servers"
                      isInputLables={true}
                      formik={formik}
                      options={
                        formik.values.targetConfig?.servers
                          ? formik.values.targetConfig?.servers.map((item) => ({
                              key: "",
                              value: item,
                            }))
                          : []
                      }
                      isKeys={false}
                      buttonText="actions.add_server"
                      showError={
                        formik.errors.targetConfig?.servers ? true : false
                      }
                      errorMessage={formik.errors.targetConfig?.servers}
                    />
                  </Col>
                </Row>
              </Col>
              <Col sm={8}>
                <Row className="mt-4">
                  <GluuLabel required label="fields.base_dns" size={4} />
                  <Col sm={8}>
                    <GluuProperties
                      compName="targetConfig.baseDNs"
                      isInputLables={true}
                      formik={formik}
                      options={
                        formik.values.targetConfig?.baseDNs
                          ? formik.values.targetConfig?.baseDNs.map((item) => ({
                              key: "",
                              value: item,
                            }))
                          : []
                      }
                      isKeys={false}
                      buttonText="actions.add_base_dn"
                      showError={
                        formik.errors.targetConfig?.baseDNs ? true : false
                      }
                      errorMessage={formik.errors.targetConfig?.baseDNs}
                    />
                  </Col>
                </Row>
              </Col>
              <Row>
                <Col sm={2} className="mt-3">
                  <Button
                    type="button"
                    color={`primary-${selectedTheme}`}
                    className="theme-config__trigger mt-3"
                    onClick={toggle}
                  >
                    {t("actions.change_bind_password")}
                  </Button>
                </Col>
              </Row>
              <Col sm={8} className="mt-3">
                <GluuCheckBoxRow
                  label="fields.use_ssl"
                  name="targetConfig.useSSL"
                  required
                  handleOnChange={(e) => {
                    formik.setFieldValue(
                      "targetConfig.useSSL",
                      e.target.checked
                    );
                  }}
                  lsize={4}
                  rsize={8}
                  value={formik.values.targetConfig?.useSSL}
                />
              </Col>
            </>
          )}
          <Row>
            <Col>
              <GluuCommitFooter
                hideButtons={{ save: true, back: false }}
                type="submit"
              />
            </Col>
          </Row>
        </FormGroup>
        {modal && (
          <BindPasswordModal
            handleChangePassword={handleChangePassword}
            handler={toggle}
            isOpen={modal}
          />
        )}
      </Form>
    </>
  );
};

export default SourceBackendServers;
