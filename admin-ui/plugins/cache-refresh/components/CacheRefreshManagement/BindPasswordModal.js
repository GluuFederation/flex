import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import applicationstyle from "../../../../app/routes/Apps/Gluu/styles/applicationstyle";
import { ThemeContext } from "Context/theme/themeContext";
import GluuInputRow from "Routes/Apps/Gluu/GluuInputRow";
import { FormGroup } from "Components";
import { useFormik } from "formik";

const BindPasswordModal = ({ handler, isOpen, handleChangePassword }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_new_password: "",
      isValid: true,
      errorMessage: "",
    },
    setFieldValue: (field) => {
      delete values[field];
    },
  });

  const handleSetNewPassword = () => {
    if (formik.values.new_password !== formik.values.confirm_new_password) {
      formik.setFieldValue(
        "errorMessage",
        `${t("messages.both_password_should_match")}.`
      );
      formik.setFieldValue("isValid", false);
      return;
    }
    handler();
    handleChangePassword(formik.values.new_password);
  };

  return (
    <Modal
      centered
      isOpen={isOpen}
      style={{ minWidth: "45vw" }}
      toggle={handler}
      className="modal-outline-primary"
    >
      <ModalHeader style={{ padding: "16px" }} toggle={handler}>
        <h4 style={{ fontWeight: 500 }}>Change Backend Bind Password</h4>
      </ModalHeader>
      <ModalBody style={{ overflowX: "auto", maxHeight: "60vh" }}>
        <FormGroup row>
          <Row>
            <GluuInputRow
              label="fields.enter_new_password"
              name="new_password"
              value={formik.values.new_password}
              type="password"
              formik={formik}
              required
            />
          </Row>
          <Row>
            <GluuInputRow
              label="fields.confirm_the_new_password"
              name="confirm_new_password"
              value={formik.values.confirm_new_password}
              type="password"
              formik={formik}
              required
            />
          </Row>
          {!formik.values.isValid && (
            <div style={{ color: "red" }}>{formik.values.errorMessage}</div>
          )}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          color={`primary-${selectedTheme}`}
          style={applicationstyle.buttonStyle}
          onClick={handler}
        >
          {t("actions.close")}
        </Button>
        <Button
          color={`primary-${selectedTheme}`}
          style={applicationstyle.buttonStyle}
          onClick={handleSetNewPassword}
        >
          {t("actions.set_password")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BindPasswordModal;
