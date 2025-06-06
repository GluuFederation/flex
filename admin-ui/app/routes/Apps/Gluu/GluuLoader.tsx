import BlockUi from "../../../components/BlockUi/BlockUi";
import { useTranslation } from "react-i18next";

function GluuLoader(props: any) {
  const { t } = useTranslation();
  return (
    <BlockUi
      tag="div"
      blocking={props.blocking}
      keepInView={true}
      renderChildren={true}
      message={t("messages.request_waiting_message")}
    >
      {props.children}
    </BlockUi>
  );
}
export default GluuLoader;
