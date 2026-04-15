import { Container, Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'
import { formatDate as formatTokenDate } from '@/utils/dayjsUtils'
import {
  EM_DASH_PLACEHOLDER,
  TOKEN_DATE_DISPLAY_FORMAT,
  TOKEN_DETAIL_DOC_SECTION,
  TWO_DASH_PLACEHOLDER,
} from './constants'
import { useStyles } from './components/styles/ClientActiveTokenDetailPage.style'
import type { ClientActiveTokenDetailPageProps } from './types'

const formatDate = (value: string | number | Date | null | undefined): string =>
  value ? formatTokenDate(value, TOKEN_DATE_DISPLAY_FORMAT) : TWO_DASH_PLACEHOLDER

const ClientActiveTokenDetailPage = ({ row }: ClientActiveTokenDetailPageProps): JSX.Element => {
  const { rowData } = row
  const { classes } = useStyles()

  return (
    <Container className={classes.container}>
      <Row>
        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.created_date"
            value={formatDate(rowData.creationDate)}
            doc_category={TOKEN_DETAIL_DOC_SECTION}
            doc_entry="creationDate"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.expiration_date"
            value={formatDate(rowData.expirationDate)}
            doc_category={TOKEN_DETAIL_DOC_SECTION}
            doc_entry="expirationDate"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.token_type"
            value={rowData.tokenType ?? EM_DASH_PLACEHOLDER}
            doc_category={TOKEN_DETAIL_DOC_SECTION}
            doc_entry="token_type"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.scope"
            value={rowData.scope ?? EM_DASH_PLACEHOLDER}
            doc_category={TOKEN_DETAIL_DOC_SECTION}
            doc_entry="scope"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.deleteable"
            value={rowData.deletable ? 'true' : 'false'}
            doc_category={TOKEN_DETAIL_DOC_SECTION}
            doc_entry="deletable"
          />
        </Col>

        <Col sm={6} xl={4}>
          <GluuFormDetailRow
            label="fields.attributes"
            value={JSON.stringify(rowData.attributes ?? {})}
            doc_category={TOKEN_DETAIL_DOC_SECTION}
            doc_entry="attributes"
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ClientActiveTokenDetailPage
