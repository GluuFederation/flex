import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Input } from "Components";
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle";
import { useTranslation } from "react-i18next";
import SetTitle from "Utils/SetTitle";
import { ThemeContext } from "Context/theme/themeContext";
import getThemeColor from "Context/theme/config";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import {
  getAgama,
  deleteAgama,
  addAgama,
} from "Plugins/auth-server/redux/features/agamaSlice";
import { hasPermission, AGAMA_READ, AGAMA_WRITE } from "Utils/PermChecker";
import GluuViewWrapper from "Routes/Apps/Gluu/GluuViewWrapper";
import MaterialTable from "@material-table/core";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { AGAMA_DELETE } from "Utils/PermChecker";
import CircularProgress from "@mui/material/CircularProgress";
import InfoIcon from "@mui/icons-material/Info";
import AgamaProjectConfigModal from "./AgamaProjectConfigModal";
import { updateToast } from "Redux/features/toastSlice";
import { isEmpty, set } from "lodash";
import { getJsonConfig } from "Plugins/auth-server/redux/features/jsonConfigSlice";
import SettingsIcon from "@mui/icons-material/Settings";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import GluuTabs from "Routes/Apps/Gluu/GluuTabs";
import { toast } from "react-toastify";
import axios from "axios";

const dateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

function AgamaListPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const options = {};
  const myActions = [];
  const [limit, setLimit] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [manageConfig, setManageConfig] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [getProjectName, setGetProjectName] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [shaFile, setSHAfile] = useState(null);
  const [shaStatus, setShaStatus] = useState(false);
  const [shaFileName, setShaFileName] = useState("");
  const [listData, setListData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [repoName, setRepoName] = useState(null);
  const [repositoriesData, setRespositoriesData] = useState({
    loading: true,
    repositories: [],
  });
  const configuration = useSelector(
    (state) => state.jsonConfigReducer.configuration
  );
  const isAgamaEnabled = configuration?.agamaConfiguration?.enabled;
  const isConfigLoading = useSelector(
    (state) => state.jsonConfigReducer.loading
  );

  const theme = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;
  const themeColors = getThemeColor(selectedTheme);
  const bgThemeColor = { background: themeColors.background };

  function convertFileToByteArray(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const byteArray = new Uint8Array(reader.result);
        resolve(byteArray);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async function fetchRespositoryData() {
    try {
      const response = await axios.get(
        "https://github.com/orgs/GluuFederation/repositories?q=agama-",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (
        response.data &&
        response.data.payload &&
        response.data.payload.repositories
      ) {
        const filteredRepositoriesData =
          response.data.payload.repositories.filter(
            (repo) =>
              !listData.find(
                (project) =>
                  project.details.projectMetadata.projectName === repo.name
              )
          );
        setRespositoriesData({
          loading: false,
          repositories: filteredRepositoriesData,
        });
      }
    } catch (error) {
      setRespositoriesData({ loading: false, repositories: [] });
    }
  }

  useEffect(() => {
    if (isEmpty(configuration)) {
      dispatch(getJsonConfig({ action: {} }));
    }
  }, []);

  const submitData = async () => {
    let file = await convertFileToByteArray(selectedFile);
    let object = {
      name: projectName,
      file: file,
    };
    dispatch(addAgama(object));

    setProjectName("");
    setShowAddModal(false);
  };
  const onDrop = useCallback((acceptedFiles) => {
    setProjectName("");
    // Do something with the files
    const file = acceptedFiles[0];
    setSelectedFileName(file.name);
    setSelectedFile(file);
    JSZip.loadAsync(file) // 1) read the Blob
      .then(function (zip) {
        let foundProjectName = false;
        zip.forEach(function (relativePath, zipEntry) {
          if (zipEntry.name.endsWith(".json")) {
            if (!foundProjectName) {
              zipEntry.async("string").then(function (jsonStr) {
                const jsonData = JSON.parse(jsonStr); // Parse the JSON data
                if (jsonData?.projectName) {
                  setProjectName(jsonData?.projectName);
                  foundProjectName = true;
                }
              });
            }
          }
        });
        setGetProjectName(true);
      });
  }, []);
  const onDrop2 = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];
    setShaFileName(file.name);
    setSHAfile(file);
  }, []);
  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
  } = useDropzone({
    onDrop: onDrop,
    accept: {
      "application/octet-stream": [".gama"],
      "application/x-zip-compressed": [".zip"],
    },
  });
  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
  } = useDropzone({
    onDrop: onDrop2,

    accept: {
      "text/plain": [".sha256sum"],
    },
  });

  const { totalItems, loading } = useSelector((state) => state.agamaReducer);
  const agamaList = useSelector((state) => state.agamaReducer.agamaList);
  const permissions = useSelector((state) => state.authReducer.permissions);
  SetTitle(t("titles.agama"));

  useEffect(() => {
    dispatch(getAgama());
  }, []);

  useEffect(() => {
    formDeploymentDetailsData();
  }, [agamaList]);

  const formDeploymentDetailsData = () => {
    let data = [];
    if (agamaList.length) {
      for (const project of agamaList) {
        const error =
          project?.finishedAt && project?.details?.error
            ? "Yes"
            : project?.finishedAt
            ? "No"
            : "";
        const status = project?.finishedAt ? "Processed" : "Pending";
        const deployed_on = project?.finishedAt
          ? new Intl.DateTimeFormat("en-US", dateTimeFormatOptions).format(
              new Date(project.createdAt)
            )
          : "-";
        data.push({
          ...project,
          deployed_on,
          type: project?.details?.projectMetadata?.type ?? "-",
          status,
          error,
        });
      }
    }

    setListData(data);
  };

  const onPageChangeClick = (page) => {
    let startCount = page * limit;
    options["startIndex"] = parseInt(startCount);
    options["limit"] = limit;
    options["pattern"] = null;
    setPageNumber(page);
    dispatch(getAgama(options));
  };

  const onRowCountChangeClick = (count) => {
    options["limit"] = count;
    options["pattern"] = null;
    setPageNumber(0);
    setLimit(count);
    dispatch(getAgama(options));
  };

  if (hasPermission(permissions, AGAMA_WRITE)) {
    myActions.push({
      icon: "add",
      tooltip: `${t("messages.add_role")}`,
      iconProps: { color: "primary" },
      isFreeAction: true,
      onClick: () => {
        setSelectedFile(null);
        setSelectedFileName(null);
        setGetProjectName(false);
        setSHAfile(null);
        fetchRespositoryData();
        if (isAgamaEnabled) {
          setShowAddModal(true);
        } else {
          dispatch(
            updateToast(true, "error", t("messages.agama_is_not_enabled"))
          );
        }
      },
    });
    myActions.push({
      icon: () => <InfoIcon />,
      tooltip: `${t("messages.see_project_details")}`,
      iconProps: { color: "primary" },
      isFreeAction: false,
      onClick: (event, rowData) => {
        setSelectedRow(rowData);
        setShowConfigModal(true);
      },
    });
    myActions.push({
      icon: () => <SettingsIcon />,
      tooltip: `${t("messages.manage_configurations")}`,
      iconProps: { color: "primary" },
      isFreeAction: false,
      onClick: (event, rowData) => {
        setSelectedRow(rowData);
        setShowConfigModal(true);
        setManageConfig(true);
      },
    });
  }

  const getSHA256 = async (sha256sum) => {
    const uint8Array = new Uint8Array(
      await new Blob([selectedFile]).arrayBuffer()
    );
    const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setShaStatus(hashHex === sha256sum);
  };

  const checkSHA1 = () => {
    const reader = new FileReader();

    reader.onload = () => {
      const sha256sum = reader.result;
      // setSha256sum(...sha256sum.split(" ", 1))
      getSHA256(...sha256sum.split(" ", 1));
    };

    const blob = new Blob([shaFile]);
    reader.readAsText(blob);
  };

  useEffect(() => {
    if (shaFile && selectedFile) {
      checkSHA1();
    }
  }, [shaFile, selectedFile]);

  const handleUpdateRowData = (updatedData) => {
    const foundIndex = listData.findIndex((item) => item.dn == updatedData.dn);

    if (foundIndex) {
      const error =
        updatedData?.finishedAt && updatedData?.details?.error
          ? "Yes"
          : updatedData?.finishedAt
          ? "No"
          : "";
      const status = updatedData?.finishedAt ? "Processed" : "Pending";
      const deployed_on = updatedData?.finishedAt
        ? new Intl.DateTimeFormat("en-US", dateTimeFormatOptions).format(
            new Date(updatedData.createdAt)
          )
        : "-";

      const updatedList =
        foundIndex >= 0
          ? listData.map((project, index) => {
              return index === foundIndex
                ? {
                    ...project,
                    error: error,
                    status: status,
                    deployed_on: deployed_on,
                    details: { ...project.details, ...updatedData },
                  }
                : project;
            })
          : [...listData];
      setListData(updatedList);
    }
  };

  //Modal Tabs
  const tabNames = [
    { name: t("menus.upload_agama_project"), path: "" },
    { name: t("menus.add_community_project"), path: "" },
  ];

  async function convertUrlToByteArray(repoUrl) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(repoUrl, {
          responseType: "arraybuffer",
        });
        if (response && response.data) {
          const byteArray = new Uint8Array(response.data);
          resolve(byteArray);
        }
      } catch (error) {
        console.error("Error converting URL to byte array:", error);
        reject(error);
      }
    });
  }

  const handleDeploy = async () => {
    console.log("Deploying project", repoName);

    let repoUrl = null;
    let file = null;
    try {
      const response = await axios(
        `https://api.github.com/repos/GluuFederation/${repoName}/releases/latest`
      );
      for (const asset of response.data.assets) {
        if (asset.name.endsWith(".gama")) {
          repoUrl = asset.browser_download_url;
          break;
        }
      }
      if (!repoUrl) {
        toast.error("File not found");
        return;
      }
      file = await convertUrlToByteArray(repoUrl);
      if (repoName && file) {
        const object = {
          name: repoName,
          file: file,
        };
        dispatch(addAgama(object));
      }
    } catch (error) {
      toast.error("File not found");
    } finally {
      setShowAddModal(false);
      setRepoName(null);
    }
  };

  const tabToShow = (tabName) => {
    switch (tabName) {
      case t("menus.upload_agama_project"):
        return (
          <>
            <ModalBody>
              <div
                {...getRootProps1()}
                className={isDragActive1 ? "active" : "dropzone"}
              >
                <input {...getInputProps1()} />
                {selectedFileName ? (
                  <strong>Selected File : {selectedFileName}</strong>
                ) : (
                  <p>{t("messages.drag_agama_file")}</p>
                )}
              </div>
              <div className="mt-2"></div>
              <div
                {...getRootProps2()}
                className={isDragActive2 ? "active" : "dropzone"}
              >
                <input {...getInputProps2()} />
                {shaFile ? (
                  <strong>Selected File : {shaFileName}</strong>
                ) : (
                  <p>{t("messages.drag_sha_file")}</p>
                )}
              </div>
              <div className="mt-2"></div>
              <div className="text-danger">
                {shaFile &&
                  selectedFileName &&
                  !shaStatus &&
                  "SHA256 not verified"}
              </div>
              <div className="text-success">
                {shaFile && selectedFileName && shaStatus && "SHA256 verified"}
              </div>
              {getProjectName && (
                <Input
                  type="text"
                  placeholder="Project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={() => submitData()}
                disabled={
                  shaFile && selectedFileName && shaStatus && projectName != ""
                    ? loading || isConfigLoading
                      ? true
                      : false
                    : true
                }
              >
                {loading || isConfigLoading ? (
                  <>
                    <CircularProgress size={12} /> &nbsp;
                  </>
                ) : null}
                {t("actions.add")}
              </Button>
              &nbsp;
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={() => {
                  setShowAddModal(false);
                  setRepoName(null);
                }}
              >
                {t("actions.cancel")}
              </Button>
            </ModalFooter>
          </>
        );
      case t("menus.add_community_project"):
        return (
          <>
            <ModalBody style={{ maxHeight: "" }}>
              <FormGroup>
                <FormLabel
                  style={{
                    marginBottom: "16px",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  {t("titles.select_project_deploy")}
                </FormLabel>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "0 10px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    alignItems: `${repositoriesData.loading && "center"}`,
                  }}
                >
                  {repositoriesData.loading ? (
                    <CircularProgress />
                  ) : repositoriesData.repositories?.length ? (
                    repositoriesData.repositories.map((item, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={repoName === item.name}
                            onChange={() =>
                              setRepoName(
                                repoName === item.name ? null : item.name
                              )
                            }
                            sx={{
                              transform: "scale(1.5)",
                              paddingTop: "6px",
                            }}
                          />
                        }
                        label={
                          <div>
                            <div>{item.name}</div>
                            <div style={{ fontSize: "12px", color: "gray" }}>
                              {item.description}
                            </div>
                          </div>
                        }
                        sx={{
                          alignItems: "flex-start",
                          marginBottom: "16px",
                        }}
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: "15px",
                        padding: "14px 0 ",
                      }}
                    >
                      {t("messages.no_data_found")}
                    </div>
                  )}
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                disabled={repoName === null}
                onClick={() => handleDeploy()}
              >
                {loading || isConfigLoading ? (
                  <>
                    <CircularProgress size={12} /> &nbsp;
                  </>
                ) : null}
                {t("actions.deploy")}
              </Button>
              &nbsp;
              <Button
                color={`primary-${selectedTheme}`}
                style={applicationStyle.buttonStyle}
                onClick={() => {
                  setShowAddModal(false);
                  setRepoName(null);
                }}
              >
                {t("actions.cancel")}
              </Button>
            </ModalFooter>
          </>
        );
    }
  };

  return (
    <>
      {showConfigModal && (
        <AgamaProjectConfigModal
          isOpen={showConfigModal}
          row={selectedRow}
          handleUpdateRowData={handleUpdateRowData}
          manageConfig={manageConfig}
          handler={() => {
            if (manageConfig) {
              setManageConfig(false);
            }
            setShowConfigModal(false);
          }}
        />
      )}
      <>
        {" "}
        <GluuViewWrapper canShow={hasPermission(permissions, AGAMA_READ)}>
          <MaterialTable
            key={limit}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Pagination: (props) => (
                <TablePagination
                  count={totalItems}
                  page={pageNumber}
                  onPageChange={(prop, page) => {
                    onPageChangeClick(page);
                  }}
                  rowsPerPage={limit}
                  onRowsPerPageChange={(prop, count) =>
                    onRowCountChangeClick(count.props.value)
                  }
                />
              ),
            }}
            columns={[
              {
                title: `${t("fields.name")}`,
                field: "details.projectMetadata.projectName",
              },
              {
                title: `${t("fields.type")}`,
                field: "type",
              },
              {
                title: `${t("fields.author")}`,
                field: "details.projectMetadata.author",
              },
              {
                title: `${t("fields.status")}`,
                field: "status",
              },
              {
                title: `${t("fields.deployed_on")}`,
                field: "deployed_on",
              },
              {
                title: `${t("fields.errors")}`,
                field: "error",
              },
            ]}
            data={listData}
            isLoading={loading}
            title=""
            actions={myActions}
            options={{
              search: true,
              idSynonym: "inum",
              searchFieldAlignment: "left",
              selection: false,
              pageSize: limit,
              rowStyle: (rowData) => ({
                backgroundColor: rowData.enabled ? "#33AE9A" : "#FFF",
              }),
              headerStyle: {
                ...applicationStyle.tableHeaderStyle,
                ...bgThemeColor,
              },
              actionsColumnIndex: -1,
            }}
            editable={{
              isDeleteHidden: () => !hasPermission(permissions, AGAMA_DELETE),
              onRowDelete: (oldData) => {
                return new Promise((resolve, reject) => {
                  dispatch(
                    deleteAgama({
                      name: oldData.details.projectMetadata.projectName,
                    })
                  );
                  resolve();
                });
              },
            }}
          />
        </GluuViewWrapper>
        <Modal
          isOpen={showAddModal}
          size="lg"
          style={{ maxWidth: "700px", width: "100%" }}
        >
          <ModalHeader>{t("titles.add_new_agama_project")}</ModalHeader>
          <Card>
            <GluuTabs
              tabNames={tabNames}
              tabToShow={tabToShow}
              withNavigation={true}
            />
          </Card>
        </Modal>
      </>
    </>
  );
}

export default AgamaListPage;
