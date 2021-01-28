import React from "react";

import {
  Container,
  Row,
  Card,
  CardBody,
  UncontrolledTooltip,
  Progress,
  Table,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse,
  Col
} from "./../../../components";
import { setupPage } from "./../../../components/Layout/setupPage";

/*eslint-disable */
const progressCompletion = ["25", "50", "75", "97"];
/*eslint-enable */

const Reports = () => <Container></Container>;

export default setupPage({
  pageTitle: "Reports"
})(Reports);
