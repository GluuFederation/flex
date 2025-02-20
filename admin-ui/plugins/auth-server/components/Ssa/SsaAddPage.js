import React, { useEffect, useState } from "react";
import SetTitle from "Utils/SetTitle";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import { CardBody, Card, Form, Col, Row, FormGroup } from "Components";
import { useFormik } from "formik";
import GluuInputRow from "Routes/Apps/Gluu/GluuInputRow";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import GluuCommitFooter from "Routes/Apps/Gluu/GluuCommitFooter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GluuTypeAhead from "Routes/Apps/Gluu/GluuTypeAhead";
import GluuCommitDialog from "Routes/Apps/Gluu/GluuCommitDialog";
import { useDispatch, useSelector } from "react-redux";
import { createSsa, toggleSaveConfig } from "../../redux/features/SsaSlice";
import { buildPayload } from "Utils/PermChecker";
import { useNavigate } from "react-router";
import GluuToogleRow from "Routes/Apps/Gluu/GluuToogleRow";
import { SSA } from "Utils/ApiResources";

const grantTypes = [
  "authorization_code",
  "implicit",
  "refresh_token",
  "client_credentials",
  "password",
  "urn:ietf:params:oauth:grant-type:uma-ticket",
];

const SsaAddPage = () => {
  const userAction = {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { savedConfig } = useSelector((state) => state.ssaReducer);
  const [isExpirable, setIsExpirable] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null);
  SetTitle(t("titles.ssa_management"));
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  const toggle = () => {
    setModal(!modal);
  };

  const formik = useFormik({
    initialValues: {
      software_id: "",
      one_time_use: false,
      org_id: "",
      description: "",
      software_roles: [],
      rotate_ssa: false,
      grant_types: "",
    },
    validationSchema: Yup.object({
      software_id: Yup.mixed(),
      software_roles: Yup.array(),
      description: Yup.mixed(),
      org_id: Yup.mixed(),
      grant_types: Yup.array(),
    }),
    onSubmit: (values) => {
      toggle();
    },
  });

  const submitForm = (userMessage) => {
    toggle();

    const {
      description,
      software_id,
      software_roles,
      grant_types,
      one_time_use,
      rotate_ssa,
      org_id,
    } = formik.values;

    const timestamp = new Date(expirationDate).getTime();

    const date = expirationDate ? Math.floor(timestamp / 1000) : null;

    buildPayload(userAction, userMessage, {
      description,
      software_id,
      software_roles: software_roles?.map((role) => role.software_roles),
      grant_types,
      expiration: isExpirable ? date : isExpirable,
      one_time_use,
      rotate_ssa,
      org_id,
    });

    dispatch(createSsa({ action: userAction }));
  };

  useEffect(() => {
    if (savedConfig) {
      navigate("/auth-server/config/ssa");
    }

    return () => dispatch(toggleSaveConfig(false));
  }, [savedConfig]);

  function handleExpirable() {
    setIsExpirable(!isExpirable);
  }

  return (
    <>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <GluuInputRow
              label="fields.software_id"
              name="software_id"
              formik={formik}
              // required
              errorMessage={formik.errors.software_id}
              showError={
                formik.errors.software_id && formik.touched.software_id
              }
              doc_category={SSA}
              value={formik.values.software_id}
            />
            <GluuInputRow
              label="fields.organization"
              name="org_id"
              formik={formik}
              // required
              errorMessage={formik.errors.org_id}
              showError={formik.errors.org_id && formik.touched.org_id}
              value={formik.values.org_id}
              doc_category={SSA}
            />
            <GluuInputRow
              label="fields.description"
              name="description"
              formik={formik}
              // required
              errorMessage={formik.errors.description}
              showError={
                formik.errors.description && formik.touched.description
              }
              doc_category={SSA}
              value={formik.values.description}
            />
            <GluuTypeAhead
              name="software_roles"
              label={t("fields.software_roles")}
              formik={formik}
              options={[]}
              lsize={3}
              rsize={7}
              // required
              value={[]}
              showError={
                formik.errors.software_roles && formik.touched.software_roles
              }
              doc_category={SSA}
              errorMessage={formik.errors.software_roles}
            />
            <GluuTypeAhead
              name="grant_types"
              label="fields.grant_types"
              formik={formik}
              value={formik.values.grant_types || []}
              options={grantTypes}
              lsize={3}
              rsize={9}
              // required
              showError={
                formik.errors.grant_types && formik.touched.grant_types
              }
              doc_category={SSA}
              errorMessage={formik.errors.grant_types}
            />
            <GluuToogleRow
              name="one_time_use"
              formik={formik}
              label="fields.one_time_use"
              value={formik.values.one_time_use}
              lsize={3}
              rsize={7}
              doc_category={SSA}
            />
            <GluuToogleRow
              name="rotate_ssa"
              formik={formik}
              label="fields.rotate_ssa"
              value={formik.values.rotate_ssa}
              lsize={3}
              rsize={7}
              doc_category={SSA}
            />
            <FormGroup row>
              <Col sm={6}>
                <GluuToogleRow
                  name="expiration"
                  label="fields.is_expirable"
                  value={isExpirable}
                  handler={handleExpirable}
                  lsize={6}
                  rsize={6}
                  doc_category={SSA}
                />
              </Col>
              <Col sm={6}>
                {isExpirable && (
                  <FormGroup row>
                    <Col sm={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="MM/DD/YYYY"
                          id="date-picker-inline"
                          value={expirationDate}
                          onChange={(date) => setExpirationDate(date)}
                          disablePast
                        />
                      </LocalizationProvider>
                    </Col>
                  </FormGroup>
                )}
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <GluuCommitFooter
                  saveHandler={toggle}
                  hideButtons={{ save: true, back: false }}
                  type="submit"
                />
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </>
  );
};

export default SsaAddPage;
