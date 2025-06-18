import React from "react";
import classNames from "classnames";
import CardHeader from "./../CardHeader";
import { Consumer } from "./context";
import classes from "./AccordionHeader.scss";
import { AccordionHeaderProps } from "./Accordion.d";

interface AccordionContext {
  onToggle: () => void;
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = (props) => (
  <Consumer>
    {(context) => {
      const typedContext = context as AccordionContext;
      return (
        <CardHeader
          className={classNames(props.className, classes.header)}
          onClick={typedContext.onToggle}
        >
          {props.children}
        </CardHeader>
      );
    }}
  </Consumer>
);
