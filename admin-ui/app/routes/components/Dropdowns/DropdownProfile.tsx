import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownItem } from "Components";
import { useTranslation } from "react-i18next";
import { auditLogoutLogs } from "../../../../plugins/user-management/redux/features/userSlice";

const DropdownProfile = ({ position = "", end, userinfo }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isUserLogout } = useSelector((state: any) => state.userReducer);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(auditLogoutLogs({ message: "User logged out mannually" }));
  };

  useEffect(() => {
    if (isUserLogout) {
      navigate("/logout");
    }
  }, [isUserLogout]);

  return (
    <DropdownMenu end={end}>
      <DropdownItem header>
        {userinfo.user_name || userinfo.name || userinfo.given_name}
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem tag={Link} to="/profile">
        {t("menus.my_profile")}
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem
        tag={Link}
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}
      >
        <i className="fa fa-fw fa-sign-out me-2"></i>
        {t("menus.signout")}
      </DropdownItem>
    </DropdownMenu>
  );
};
export { DropdownProfile };
