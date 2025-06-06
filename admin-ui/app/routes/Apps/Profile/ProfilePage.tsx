import React, { useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  AvatarImage,
} from "Components";
import { ErrorBoundary } from "react-error-boundary";
import GluuErrorFallBack from "../Gluu/GluuErrorFallBack";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../context/theme/themeContext";
import SetTitle from "Utils/SetTitle";
import styles from "./styles";
import { Box, Divider, Skeleton } from "@mui/material";
import { useNavigate } from "react-router";
import { getProfileDetails } from "Redux/features/ProfileDetailsSlice";
import { randomAvatar } from "../../../utilities";
import { setSelectedUserData } from "Plugins/user-management/redux/features/userSlice";
import { USER_WRITE, hasPermission } from "Utils/PermChecker";
import getThemeColor from "../../../context/theme/config";

// --- TypeScript interfaces ---
interface CustomAttribute {
  name: string;
  values: string[];
}

interface ProfileDetails {
  displayName?: string;
  givenName?: string;
  mail?: string;
  status?: string;
  inum?: string;
  customAttributes?: CustomAttribute[];
}

interface UserInfo {
  inum?: string;
  family_name?: string;
  [key: string]: any;
}

interface ProfileDetailsState {
  loading: boolean;
  profileDetails: ProfileDetails | null;
}

interface AuthState {
  userinfo: UserInfo;
  token?: { scopes?: string[] } | null;
  permissions?: string[];
}

interface RootState {
  profileDetailsReducer: ProfileDetailsState;
  authReducer: AuthState;
  token?: { scopes?: string[] };
}

interface ThemeContextType {
  state: { theme: string };
  dispatch: React.Dispatch<any>;
}
// --- End TypeScript interfaces ---

const ProfileDetails = () => {
  const { t } = useTranslation();
  const { loading, profileDetails } = useSelector((state: RootState) => state.profileDetailsReducer);
  const scopes = useSelector((state: RootState) =>
    state.token ? state.token.scopes : state.authReducer.permissions
  );
  const { userinfo } = useSelector((state: RootState) => state.authReducer);
  const theme = useContext(ThemeContext) as ThemeContextType;
  const selectedTheme = theme.state.theme;
  const themeColors = getThemeColor(theme.state.theme as string);
  const navigate = useNavigate();
  const { classes } = styles();
  SetTitle(t("titles.profile_detail"));
  const dispatch = useDispatch();

  useEffect(() => {
    if (userinfo?.inum) {
      dispatch(getProfileDetails({ action: { pattern: userinfo.inum } }));
    }
  }, [dispatch, userinfo?.inum]);

  const navigateToUserManagement = () => {
    if (profileDetails) {
      dispatch(setSelectedUserData(profileDetails));
      navigate(`/user/usermanagement/edit/:` + profileDetails.inum);
    }
  };

  const jansAdminUIRole = profileDetails?.customAttributes?.find(
    (att: CustomAttribute) => att?.name === "jansAdminUIRole"
  );

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <Container>
        <Row className={classes.centerCard}>
          <Col xs={10} md={8} lg={5}>
            <Card>
              <CardBody className={classes.profileCard}>
                <React.Fragment>
                  <Box
                    className={`${classes.avatar_wrapper} d-flex justify-content-center my-3`}
                  >
                    <AvatarImage size="lg" src={randomAvatar()} />
                  </Box>
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <Box display={"flex"} flexDirection={"column"} gap={1}>
                      {loading ? (
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <Skeleton
                            width={"45%"}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            animation="wave"
                          />
                        </Box>
                      ) : (
                        <Box
                          fontWeight={700}
                          fontSize={"16px"}
                          className="text-center mb-4"
                        >
                          {profileDetails?.displayName}
                        </Box>
                      )}
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          mb={1}
                        >
                          <Box fontWeight={700}>First Name</Box>
                          <Box>{profileDetails?.givenName}</Box>
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          mb={1}
                        >
                          <Box fontWeight={700}>Last Name</Box>
                          <Box>{userinfo.family_name}</Box>
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          mb={1}
                        >
                          <Box fontWeight={700}>Email</Box>
                          <Box>{profileDetails?.mail}</Box>
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          mb={1}
                          gap={3}
                        >
                          <Box fontWeight={700}>User Roles</Box>
                          {jansAdminUIRole?.values && (
                            <Box
                              display={"flex"}
                              gap={"2px"}
                              flexWrap={"wrap"}
                              alignItems={"end"}
                              justifyContent={"end"}
                            >
                              {jansAdminUIRole?.values.map((role: string, index: number) => (
                                <Badge
                                  style={{ padding: "4px 6px" }}
                                  color={`primary-${selectedTheme}`}
                                  className="me-1"
                                  key={index}
                                >
                                  <span
                                    style={{ color: themeColors.fontColor }}
                                  >
                                    {role}
                                  </span>
                                </Badge>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          mb={1}
                        >
                          <Box fontWeight={700}>Status</Box>
                          <Box>{profileDetails?.status || "-"}</Box>
                        </Box>
                      )}
                      <Divider />
                    </Box>
                    {hasPermission(scopes, USER_WRITE) ? (
                      <>
                        {loading ? (
                          <Skeleton animation="wave" height={40} />
                        ) : (
                          <Button
                            color={`primary-${selectedTheme}`}
                            onClick={navigateToUserManagement}
                          >
                            <i className="fa fa-pencil me-2" />
                            {t("actions.edit")}
                          </Button>
                        )}
                      </>
                    ) : null}
                  </Box>
                </React.Fragment>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default ProfileDetails;
