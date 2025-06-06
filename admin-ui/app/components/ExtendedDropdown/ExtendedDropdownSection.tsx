import classNames from "classnames";
import { ReactNode, ElementType } from "react";

interface ExtendedDropdownSectionProps {
  children?: ReactNode;
  list?: boolean;
  className?: string;
  tag?: ElementType;
  [key: string]: any; // for other props
}

const ExtendedDropdownSection = (props: ExtendedDropdownSectionProps) => {
  const { children, list, className, tag, ...otherProps } = props;
  const sectionClass = classNames("extended-dropdown__section", className, {
    "extended-dropdown__section--list": list,
  });
  const Tag = tag || "div";

  return (
    <Tag className={sectionClass} {...otherProps}>
      {children}
    </Tag>
  );
};

ExtendedDropdownSection.defaultProps = {
  tag: "div",
};

export { ExtendedDropdownSection };
