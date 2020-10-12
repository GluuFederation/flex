import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, DropdownItem } from "shards-react";

const ControlPanel = () => {
  const { t } = useTranslation();
  return (
    <div>
      <DropdownItem divider />
      <Row form>
        <Col md="6" className="form-group">
          <Button type="submit" theme="primary">
            <i className="material-icons">save_alt</i>
            {t("button.save")}
          </Button>
        </Col>
        <Col md="6" className="form-group">
          <Button type="reset" theme="warning" style={{ float: "right" }}>
            <i className="material-icons">arrow_back</i>
            {t("button.cancel")}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default ControlPanel;
