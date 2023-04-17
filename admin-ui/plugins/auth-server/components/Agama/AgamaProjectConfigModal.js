import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ThemeContext } from "Context/theme/themeContext";
import axios from "../../../../app/redux/api/axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@material-ui/core";
import MaterialTable from "@material-table/core";
import { useDispatch } from "react-redux";
import { updateToast } from "../../../../app/redux/actions/ToastAction";
import { isEmpty } from "lodash";

const AgamaProjectConfigModal = ({
  isOpen,
  row,
  handler,
  handleUpdateRowData,
  manageConfig = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token.access_token);
  const theme = useContext(ThemeContext);
  const name = row.details.projectMetadata.projectName;
  const selectedTheme = theme.state.theme;
  const [configDetails, setConfigDetails] = useState({
    isLoading: false,
    data: {},
  });
  const [projectDetails, setProjectDetails] = useState({
    isLoading: true,
    data: {},
  });

  useEffect(() => {
    getAgamaProjectDetails();
  }, []);

  useEffect(() => {
    if (manageConfig) {
      getConfigDetails();
    }
  }, [manageConfig]);

  function getConfigDetails() {
    setConfigDetails((prevState) => ({ ...prevState, isLoading: true }));

    axios
      .get("/api/v1/agama-deployment/configs/" + name, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      // .then(response => response.blob())
      .then((response) => {
        setConfigDetails((prevState) => ({
          ...prevState,
          data: response.data,
        }));
        // dispatch(updateToast(true, 'success'))
      })
      .finally(() => {
        setConfigDetails((prevState) => ({ ...prevState, isLoading: false }));
      });
  }

  function getAgamaProjectDetails() {
    setProjectDetails((prevState) => ({ ...prevState, isLoading: true }));
    axios
      .get("/api/v1/agama-deployment/" + name, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          let tableOptions = [];

          if (response.data.details.flowsError) {
            for (const flow in response.data.details.flowsError) {
              const error = response.data.details.flowsError[flow];
              tableOptions.push({ flow: flow, error });
            }
          }

          setProjectDetails((prevState) => ({
            ...prevState,
            data: {
              ...response?.data,
              statusCode: response.status,
              tableOptions: tableOptions,
            },
          }));

          handleUpdateRowData(response.data);
        }

        if (response.status === 204) {
          setProjectDetails((prevState) => ({
            ...prevState,
            data: {
              statusCode: response.status,
            },
          }));
        }
      })
      .catch((error) => {})
      .finally(() => {
        setProjectDetails((prevState) => ({ ...prevState, isLoading: false }));
      });
  }

  function save_data(data) {
    try {
      // Convert fdata.save_data to a Blob object
      const blob = new Blob([data], { type: "application/json" });

      // Create a download link for the Blob object
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "data.json";

      // Trigger a click event on the download link to download the file
      link.dispatchEvent(new MouseEvent("click"));

      // Clean up the download link and URL object
      URL.revokeObjectURL(url);
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }

      // Show a success message to the user
      // dispatch(updateToast(true, 'success', 'File saved successfully'));
    } catch (e) {
      // Show an error message to the user
      alert(`An error occurred while saving the file: ${e.message}`);
    }
  }

  return (
    <Modal
      centered
      isOpen={isOpen}
      style={{ minWidth: "45vw" }}
      toggle={handler}
      className="modal-outline-primary"
    >
      <ModalHeader
        style={{ padding: "16px", width: "100%" }}
        title={`project ${name}`}
        toggle={handler}
      >
        {manageConfig
          ? `Manage Configuration for Project ${name}`
          : `Details of project ${name}`}
      </ModalHeader>
      <ModalBody style={{ overflowX: "auto", maxHeight: "60vh" }}>
        {projectDetails?.data?.statusCode === 204 && (
          <p>
            Project <b>{name}</b> is still being deployed. Try again in 1
            minute.
          </p>
        )}

        {projectDetails.isLoading || configDetails.isLoading ? (
          t("messages.fetching_project_details")
        ) : (
          <>
            {projectDetails.data.statusCode === 200 && (
              <>
                {manageConfig ? (
                  <>
                    {isEmpty(
                      projectDetails?.data?.details?.projectMetadata?.configs
                    ) ? (
                      <Box>
                        No sample configurations defined <b>{name}</b>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="subtitle2">
                          Export sample configurations
                        </Typography>
                        <Box>
                          {JSON.stringify(
                            projectDetails?.data?.details?.projectMetadata
                              ?.configs,
                            null,
                            2
                          )}
                        </Box>
                        <Button
                          onClick={() =>
                            save_data(
                              JSON.stringify(
                                projectDetails?.data?.details?.projectMetadata
                              )
                            )
                          }
                        >
                          Export Sample Config
                        </Button>
                      </>
                    )}
                    <Typography variant="subtitle2">
                      Export current configurations
                    </Typography>

                    {isEmpty(configDetails.data) ? (
                      <Box>No configurations defined</Box>
                    ) : (
                      <>
                        <Box>
                          {JSON.stringify(configDetails.data?.configs, null, 2)}
                        </Box>
                        <Button
                          onClick={() =>
                            save_data(JSON.stringify(configDetails.data))
                          }
                        >
                          Export Current Config
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Box>
                      {t("fields.version")}:{" "}
                      {projectDetails.data?.details?.projectMetadata?.version ??
                        "-"}
                    </Box>
                    <Box>
                      {t("fields.description")}:{" "}
                      {projectDetails.data?.details?.projectMetadata
                        ?.description ?? "-"}
                    </Box>
                    <Box>
                      {t("fields.deployed_started_on")}:{" "}
                      {projectDetails.data?.createdAt ?? "-"}
                    </Box>
                    <Box>
                      {t("fields.deployed_finished_on")}:{" "}
                      {projectDetails.data?.finishedAt ?? "-"}
                    </Box>
                    <Box>
                      {t("fields.errors")}:{" "}
                      {projectDetails.data?.details?.error ?? "No"}
                    </Box>
                    <Box mt={2}>
                      <MaterialTable
                        components={{
                          Toolbar: (props) => undefined,
                        }}
                        columns={[
                          { title: `${t("fields.flow")}`, field: "flow" },
                          {
                            title: `${t("fields.error")}`,
                            field: "error",
                          },
                        ]}
                        data={projectDetails.data.tableOptions}
                        isLoading={projectDetails.isLoading}
                        title=""
                        options={{
                          search: false,
                          selection: false,
                          paging: false,
                        }}
                      />
                    </Box>
                  </>
                )}
              </>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color={`primary-${selectedTheme}`} onClick={handler}>
          {t("actions.close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AgamaProjectConfigModal;
