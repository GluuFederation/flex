import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { useTranslation } from "react-i18next";
const CertificatesListPage = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-1">
        <PageTitle
          sm="4"
          subtitle="EXTRA"
          title="CERTIFICATES"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Available Certificates</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      #
                    </th>
                    <th scope="col" className="border-0">
                      Alias
                    </th>
                    <th scope="col" className="border-0">
                      Algorithm
                    </th>
                    <th scope="col" className="border-0">
                      Valid From
                    </th>
                    <th scope="col" className="border-0">
                      Valid To
                    </th>
                    <th scope="col" className="border-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>OpenDJ SSL</td>
                    <td>SHA256WITHRSA</td>
                    <td>Mon Jan 27 20:14:36 WAT 2020</td>
                    <td>Sun Jan 22 20:14:36 WAT 2040</td>
                    <td>
                      <Button>
                        <i class="material-icons">save_alt</i> Download
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>OpenDJ SSL</td>
                    <td>SHA256WITHRSA</td>
                    <td>Mon Jan 27 20:14:36 WAT 2020</td>
                    <td>Sun Jan 22 20:14:36 WAT 2040</td>
                    <td>
                      <Button>
                        <i class="material-icons">save_alt</i> Download
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>OpenDJ SSL</td>
                    <td>SHA256WITHRSA</td>
                    <td>Mon Jan 27 20:14:36 WAT 2020</td>
                    <td>Sun Jan 22 20:14:36 WAT 2040</td>
                    <td>
                      <Button>
                        <i class="material-icons">save_alt</i> Download
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CertificatesListPage;
