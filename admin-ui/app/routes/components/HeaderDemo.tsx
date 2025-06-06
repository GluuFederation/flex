import { Media } from "reactstrap";

const HeaderDemo = ({ no, title, subTitle, children, className }: any) => (
  <Media className={`mb-3 ${className}`}>
    <Media left top>
      <h1 className="me-3 display-4 text-muted">{no}.</h1>
    </Media>
    <Media body>
      <h4 className="mt-1">{title}</h4>
      <p>{children || subTitle}</p>
    </Media>
  </Media>
);
export { HeaderDemo };
