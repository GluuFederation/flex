import React from "react";
import {
  Badge,
  FormGroup,
  Card,
  Col,
  CardBody,
  CustomInput,
} from "../../../../app/components";
import GluuLabel from "../../../../app/routes/Apps/Gluu/GluuLabel";
import { CACHE } from "../../../../app/utils/ApiResources";
import GluuTooltip from "../../../../app/routes/Apps/Gluu/GluuTooltip";
import GluuInputRow from "../../../../app/routes/Apps/Gluu/GluuInputRow";
import { useTranslation } from "react-i18next";

function CacheMemcached({ config, formik }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardBody>
        <GluuTooltip doc_category={CACHE} doc_entry="servers">
          <FormGroup row>
            <GluuLabel label="fields.servers" size={6} />
            <Col sm={6}>
              <Badge color="primary">{config.servers}</Badge>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuTooltip doc_category={CACHE} doc_entry="connectionFactoryType">
          <FormGroup row>
            <GluuLabel label="fields.connection_factory_type" size={6} />
            <Col sm={6}>
              <CustomInput
                type="select"
                id="connectionFactoryType"
                name="connectionFactoryType"
                defaultValue={config.connectionFactoryType}
                onChange={formik.handleChange}
                data-testid="connectionFactoryType"
              >
                <option value="DEFAULT">{t("options.default")}</option>
                <option value="BINARY">{t("options.binary")}</option>
              </CustomInput>
            </Col>
          </FormGroup>
        </GluuTooltip>
        <GluuInputRow
          label="fields.max_operation_queue_length"
          name="maxOperationQueueLength"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={config.maxOperationQueueLength}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.buffer_size"
          name="bufferSize"
          type="number"
          formik={formik}
          lsize={6}
          rsize={6}
          value={config.bufferSize}
          doc_category={CACHE}
        />
        <GluuInputRow
          label="fields.default_put_expiration"
          name="memDefaultPutExpiration"
          type="number"
          lsize={6}
          rsize={6}
          formik={formik}
          value={config.memDefaultPutExpiration}
          doc_category={CACHE}
        />
      </CardBody>
    </Card>
  );
}

export default CacheMemcached;
