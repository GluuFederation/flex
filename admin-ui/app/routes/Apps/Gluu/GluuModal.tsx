import { useContext } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import applicationStyle from "./styles/applicationstyle";
import { ThemeContext } from "Context/theme/themeContext";

function GluuModal({ title, modal, handler, onAccept }: any) {
  const { t } = useTranslation();
  const theme: any = useContext(ThemeContext);
  const selectedTheme = theme.state.theme;

  return (
    <Modal isOpen={modal} toggle={handler} className="modal-outline-primary">
      <ModalHeader toggle={handler}>
        <i
          style={{ color: "red" }}
          className="fa fa-2x fa-item fa-fw modal-icon mb-3"
        ></i>
        {title}
      </ModalHeader>
      <ModalBody>
        <Input placeholder={t("placeholders.redirect_uri")} />
      </ModalBody>
      <ModalFooter>
        <Button
          color={`primary-${selectedTheme}`}
          style={applicationStyle.buttonStyle}
          onClick={onAccept}
        >
          {t("actions.add")}
        </Button>
        &nbsp;
        <Button
          color={`primary-${selectedTheme}`}
          style={applicationStyle.buttonStyle}
          onClick={handler}
        >
          {t("ations.cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default GluuModal;
