import React from "react";
import { Container, Row, Col, Card, ButtonGroup, Button } from "shards-react";
import { NavLink } from "react-router-dom";
import PageTitle from "../components/common/PageTitle";

import DropzoneArea from "../components/file-manager-cards/DropzoneArea";
import MetaActions from "../components/file-manager-cards/MetaActions";
import SectionTitle from "../components/file-manager-cards/SectionTitle";
import DirectoriesList from "../components/file-manager-cards/DirectoriesList";
import DocumentsList from "../components/file-manager-cards/DocumentsList";

const FileManagerCards = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="File Manager" subtitle="Dashboards" className="text-sm-left mb-3" />

      {/* Page Header :: Actions */}
      <Col className="col d-flex">
        <ButtonGroup size="sm" className="d-inline-flex ml-auto my-auto ml-auto mr-auto mr-sm-0">
          <Button theme="white" tag={NavLink} to="/file-manager-list">
            <i className="material-icons">&#xE8EF;</i>
          </Button>
          <Button theme="white" tag={NavLink} to="/file-manager-cards">
            <i className="material-icons">&#xE8F0;</i>
          </Button>
        </ButtonGroup>
      </Col>
    </Row>

    <div className="file-manager file-manager-cards">
      <Card small className="mb-3">
        {/* Dropzone */}
        <DropzoneArea />

        {/* Meta Actions */}
        <MetaActions />
      </Card>

      {/* Directories */}
      <SectionTitle title="Directories" />
      <DirectoriesList />

      {/* Documents */}
      <SectionTitle title="Documents" />
      <DocumentsList />
    </div>
  </Container>
);

export default FileManagerCards;
