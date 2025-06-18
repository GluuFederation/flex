import { Media } from "Components";

interface ActivityProps {
  iconColorBelow?: string;
  iconBelow?: string;
  iconColor?: string;
  icon?: string;
}

const Activity: React.FC<ActivityProps> = (props) => (
  <Media>
    <Media left>
      <span className="fa-stack fa-lg fa-fw d-flex me-3">
        <i
          className={`fa fa-fw fa-stack-2x fa-stack-2x text-${props.iconColorBelow} fa-${props.iconBelow}`}
        ></i>
        <i
          className={`fa fa-stack-1x fa-fw text-${props.iconColor} fa-${props.icon}`}
        ></i>
      </span>
    </Media>
    <Media body>
      <span className="h6">
        {"faker.name.firstName()"} {"faker.name.lastName()"}
      </span>{" "}
      changed Description to &quot;{"faker.random.words()"}&quot;
      <p className="mt-2 mb-1">{"faker.lorem.sentence()"}</p>
      <div className="small mt-2">{"faker.date.past().toString()"}</div>
    </Media>
  </Media>
);
export { Activity };
