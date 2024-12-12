import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Form, FormGroup } from "Components";
import GluuInputRow from "Routes/Apps/Gluu/GluuInputRow";
import GluuSelectRow from "Routes/Apps/Gluu/GluuSelectRow";
import { useTranslation } from "react-i18next";
import UserClaimEntry from "./UserClaimEntry";
import { useSelector, useDispatch } from "react-redux";
import GluuLoader from "Routes/Apps/Gluu/GluuLoader";
import GluuCommitDialog from "Routes/Apps/Gluu/GluuCommitDialog";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { changeUserPassword } from "../../redux/features/userSlice";
import { ThemeContext } from "Context/theme/themeContext";
import { getAttributesRoot } from "Redux/features/attributesSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { debounce } from "lodash";
import { adminUiFeatures } from "Plugins/admin/helper/utils";
import moment from "moment/moment";
import { use } from "i18next";

function UserForm({ onSubmitData }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const DOC_SECTION = "user";
  const [searchClaims, setSearchClaims] = useState("");
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [modal, setModal] = useState(false);
  const [passwordmodal, setPasswordModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [modifiedFields, setModifiedFields] = useState({});
  const [operations, setOperations] = useState([]);

  const userDetails = useSelector(
    (state) => state.userReducer.selectedUserData
  );
  const personAttributes = useSelector(
    (state) => state.attributesReducerRoot.items
  );
  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  let options = {};

  const initialValues = {
    displayName: userDetails?.displayName || "",
    givenName: userDetails?.givenName || "",
    mail: userDetails?.mail || "",
    userId: userDetails?.userId || "",
    sn: "",
    middleName: "",
    status: userDetails?.status || "",
  };

  if (userDetails) {
    for (let i in userDetails.customAttributes) {
      if (userDetails.customAttributes[i].values) {
        let customAttribute = personAttributes.filter(
          (e) => e.name == userDetails.customAttributes[i].name
        );
        if (userDetails.customAttributes[i].name == "birthdate") {
          initialValues[userDetails.customAttributes[i].name] = moment(
            userDetails.customAttributes[i].values[0]
          ).format("YYYY-MM-DD");
        } else {
          if (customAttribute[0]?.oxMultiValuedAttribute) {
            initialValues[userDetails.customAttributes[i].name] =
              userDetails.customAttributes[i].values;
          } else {
            initialValues[userDetails.customAttributes[i].name] =
              userDetails.customAttributes[i].values[0];
          }
        }
      }
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      toggle();
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required("Display name is required."),
      givenName: Yup.string().required("First name is required."),
      sn: Yup.string().required("Last name is required."),
      userId: Yup.string().required("User name is required."),
      mail: Yup.string().required("Email is required."),
    }),
    setFieldValue: (field) => {
      delete values[field];
    },
  });

  const toggle = () => {
    setModal(!modal);
  };

  const submitChangePassword = () => {
    const submitableValue = {
      inum: userDetails.inum,
      jsonPatchString: "[]",
      customAttributes: [
        {
          name: "userPassword",
          multiValued: false,
          values: [formik.values.userPassword],
        },
      ],
    };
    submitableValue['performedOn'] = {user_inum: userDetails.inum, user_name: userDetails.displayName}
    dispatch(changeUserPassword(submitableValue));
    setPasswordModal(!passwordmodal);
    toggleChangePasswordModal();
  };

  const submitForm = () => {
    toggle();
    onSubmitData(formik.values, modifiedFields);
  };
  const loading = useSelector((state) => state.userReducer.loading);
  const setSelectedClaimsToState = (data) => {
    const tempList = [...selectedClaims];
    tempList.push(data);
    setSelectedClaims(tempList);
  };

  useEffect(() => {
    if (formik.values.userConfirmPassword && formik.values.userPassword) {
      if (formik.values.userConfirmPassword != formik.values.userPassword) {
        setPasswordError(
          "Confirm password should be same as password entered."
        );
        setShowButtons(false);
      } else {
        setPasswordError("");
        setShowButtons(true);
      }
    } else {
      setPasswordError("");
    }
  }, [formik.values.userConfirmPassword, formik.values.userPassword]);

  const usedClaimes = [
    "userId",
    "displayName",
    "mail",
    "status",
    "userPassword",
    "givenName",
    "middleName",
    "sn",
  ];
  const getCustomAttributeById = (id) => {
    let claimData = null;
    for (const i in personAttributes) {
      if (personAttributes[i].name == id) {
        claimData = personAttributes[i];
      }
    }
    return claimData;
  };

  const setAttributes = () => {
    const tempList = [...selectedClaims];
    for (const i in userDetails.customAttributes) {
      if (userDetails.customAttributes[i].values) {
        const data = getCustomAttributeById(
          userDetails.customAttributes[i].name
        ) && {
          ...getCustomAttributeById(userDetails.customAttributes[i].name),
        };
        if (
          data &&
          !usedClaimes.includes(userDetails.customAttributes[i].name)
        ) {
          data.options = userDetails.customAttributes[i].values;
          tempList.push(data);
        }
      }
    }
    setSelectedClaims(tempList);
  };

  useEffect(() => {
    if (userDetails) {
      setAttributes();
      setShowButtons(true);
    } else {
      setSelectedClaims([]);
    }
  }, [userDetails]);

  const removeSelectedClaimsFromState = (id) => {
    const tempList = [...selectedClaims];
    if (userDetails) {
      formik.setFieldValue(id, "");
    } else {
      formik.setFieldValue(id);
    }
    delete modifiedFields[id];
    setModifiedFields(modifiedFields);

    const newList = tempList.filter((data, index) => data.name !== id);
    setSelectedClaims(newList);
  };

  function goBack() {
    window.history.back();
  }

  const toggleChangePasswordModal = () => {
    setChangePasswordModal(!changePasswordModal);
    formik.setFieldValue("userPassword");
    formik.setFieldValue("userConfirmPassword");
    setShowButtons(true);
  };

  return (
    <GluuLoader blocking={loading}>
      <GluuCommitDialog
        handler={() => setPasswordModal(!passwordmodal)}
        modal={passwordmodal}
        onAccept={submitChangePassword}
      />

      <Modal
        isOpen={changePasswordModal}
        toggle={toggleChangePasswordModal}
        className="modal-outline-primary"
      >
        <ModalHeader>Change Password</ModalHeader>
        <ModalBody>
          <FormGroup row>
            <Col>
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Password"
                name="userPassword"
                type="password"
                value={formik.values.userPassword || ""}
                formik={formik}
                lsize={3}
                rsize={9}
              />
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Confirm Password"
                name="userConfirmPassword"
                type="password"
                value={formik.values.userConfirmPassword || ""}
                formik={formik}
                lsize={3}
                rsize={9}
              />

              {passwordError != "" && (
                <span className="text-danger">{passwordError}</span>
              )}
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          {formik.values?.userPassword?.length > 3 &&
            formik.values?.userPassword ==
              formik.values.userConfirmPassword && (
              <Button
                color={`primary-${selectedTheme}`}
                type="button"
                onClick={() => setPasswordModal(!passwordmodal)}
              >
                {t("actions.change_password")}
              </Button>
            )}
          &nbsp;
          <Button
            color={`primary-${selectedTheme}`}
            onClick={toggleChangePasswordModal}
          >
            {t("actions.cancel")}
          </Button>
        </ModalFooter>
      </Modal>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          let values = Object.keys(modifiedFields).map((key) => {
            return {
              path: key,
              value: modifiedFields[key],
              op: "replace",
            };
          });
          setOperations(values);
          formik.handleSubmit();
        }}
      >
        <FormGroup row>
          <Col sm={8}>
            {userDetails && (
              <GluuInputRow
                label="INUM"
                name="INUM"
                doc_category={DOC_SECTION}
                value={userDetails.inum || ""}
                lsize={3}
                rsize={9}
                formik={formik}
                disabled={true}
              />
            )}
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="First Name"
              name="givenName"
              required
              value={formik.values.givenName || ""}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.givenName && formik.touched.givenName}
              errorMessage={formik.errors.givenName}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  givenName: e.target.value,
                });
              }}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Middle Name"
              name="middleName"
              value={formik.values.middleName || ""}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.middleName && formik.touched.middleName}
              errorMessage={formik.errors.middleName}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  middleName: e.target.value,
                });
              }}
            />

            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Last Name"
              name="sn"
              required
              value={formik.values.sn || ""}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.sn && formik.touched.sn}
              errorMessage={formik.errors.sn}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  lastName: e.target.value,
                });
              }}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="User Name"
              name="userId"
              required
              value={formik.values.userId || ""}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.userId && formik.touched.userId}
              errorMessage={formik.errors.userId}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  userName: e.target.value,
                });
              }}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Display Name"
              name="displayName"
              required
              value={formik.values.displayName || ""}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={
                formik.errors.displayName && formik.touched.displayName
              }
              errorMessage={formik.errors.displayName}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  displayName: e.target.value,
                });
              }}
            />
            <GluuInputRow
              doc_category={DOC_SECTION}
              label="Email"
              name="mail"
              required
              type="email"
              value={formik.values.mail || ""}
              formik={formik}
              lsize={3}
              rsize={9}
              showError={formik.errors.mail && formik.touched.mail}
              errorMessage={formik.errors.mail}
              handleChange={(e) => {
                setModifiedFields({ ...modifiedFields, mail: e.target.value });
              }}
            />

            <GluuSelectRow
              doc_category={DOC_SECTION}
              label="Status"
              name="status"
              value={formik.values.status || ""}
              values={["active", "inactive"]}
              formik={formik}
              lsize={3}
              rsize={9}
              handleChange={(e) => {
                setModifiedFields({
                  ...modifiedFields,
                  status: e.target.value,
                });
              }}
            />

            {!userDetails && (
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Password"
                required
                name="userPassword"
                type="password"
                value={formik.values.userPassword || ""}
                formik={formik}
                lsize={3}
                rsize={9}
              />
            )}
            {!userDetails && (
              <GluuInputRow
                doc_category={DOC_SECTION}
                label="Confirm Password"
                required
                name="userConfirmPassword"
                type="password"
                value={formik.values.userConfirmPassword || ""}
                formik={formik}
                lsize={3}
                rsize={9}
              />
            )}
            {passwordError != "" && !changePasswordModal && (
              <span className="text-danger">{passwordError}</span>
            )}
            {selectedClaims.map((data, key) => (
              <UserClaimEntry
                key={key}
                entry={key}
                data={data}
                formik={formik}
                handler={removeSelectedClaimsFromState}
                setModifiedFields={setModifiedFields}
                modifiedFields={modifiedFields}
              />
            ))}
            {showButtons && (
              <FormGroup row>
                <Col md={4}>
                  {userDetails && (
                    <Button
                      color={`primary-${selectedTheme}`}
                      onClick={() => setChangePasswordModal(true)}
                    >
                      <i className="fa fa-key me-2"></i>
                      {t("actions.change_password")}
                    </Button>
                  )}
                </Col>
                <Col md={8} className="text-end">
                  <Button
                    color={`primary-${selectedTheme}`}
                    type="button"
                    onClick={goBack}
                  >
                    <i className="fa fa-arrow-circle-left me-2"></i>
                    {t("actions.cancel")}
                  </Button>
                  {/* For Space in buttons */}
                  &nbsp; &nbsp; &nbsp;
                  {/* For Space in buttons */}
                  <Button color={`primary-${selectedTheme}`} type="submit">
                    <i className="fa fa-check-circle me-2"></i>
                    {t("actions.save")}
                  </Button>
                </Col>
              </FormGroup>
            )}
          </Col>
          <Col sm={4}>
            <div className="border border-light ">
              <div className="bg-light text-bold p-2">Available Claims</div>
              <input
                type="search"
                className="form-control mb-2"
                placeholder="Search Claims Here "
                onChange={(e) => {
                  setSearchClaims(e.target.value);
                  const delayDebounceFn = debounce(function () {
                    options["pattern"] = e.target.value;
                    dispatch(getAttributesRoot({ options }));
                  }, 500);
                  delayDebounceFn();
                }}
                value={searchClaims}
              />
              <ul className="list-group">
                {personAttributes.map((data, key) => {
                  const name = data.displayName.toLowerCase();
                  const alreadyAddedClaim = selectedClaims.some(
                    (el) => el.name === data.name
                  );
                  if (
                    data.status.toLowerCase() == "active" &&
                    !usedClaimes.includes(data.name)
                  ) {
                    if (
                      (name.includes(searchClaims.toLowerCase()) ||
                        searchClaims == "") &&
                      !alreadyAddedClaim
                    ) {
                      return (
                        <li
                          className="list-group-item"
                          key={"list" + key}
                          title="Click to add to the form"
                        >
                          <a
                            onClick={() => setSelectedClaimsToState(data)}
                            style={{ cursor: "pointer" }}
                          >
                            {data.displayName}
                          </a>
                        </li>
                      );
                    }
                  }
                })}
              </ul>
            </div>
          </Col>
        </FormGroup>
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          feature={adminUiFeatures.users_edit}
          formik={formik}
          operations={operations}
        />
      </Form>
    </GluuLoader>
  );
}

export default UserForm;
