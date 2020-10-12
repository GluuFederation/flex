import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Row, Col, Card, CardBody, CardFooter } from "shards-react";

class ComponentName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  /**
   * Changes the selected state for a specific document.
   */
  handleDocumentClick(file) {
    const newState = { ...this.state };
    this.setState({
      ...(newState.documents[newState.documents.indexOf(file)] = {
        ...file,
        selected: !file.selected
      })
    });
  }

  render() {
    const { documents } = this.state;
    return (
      <Row>
        {documents.map((file, idx) => {
          const classes = classNames(
            "mb-3",
            "file-manager__item",
            file.selected && "file-manager__item--selected"
          );

          return (
            <Col lg="3" sm="6" key={idx}>
              <Card
                small
                className={classes}
                onClick={() => this.handleDocumentClick(file)}
              >
                <CardBody className="file-manager__item-preview px-0 pb-0 pt-4">
                  <img src={file.image} alt={file.title} />
                </CardBody>
                <CardFooter className="border-top">
                  <span className="file-manager__item-icon">
                    <i className="material-icons">&#xE24D;</i>
                  </span>
                  <h6 className="file-manager__item-title">{file.title}</h6>
                  <span className="file-manager__item-size ml-auto">
                    {file.size}
                  </span>
                </CardFooter>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  }
}

ComponentName.propTypes = {
  /**
   * The documents array.
   */
  documents: PropTypes.array
};

ComponentName.defaultProps = {
  documents: [
    {
      id: 1,
      title: "Lorem Ipsum Document",
      size: "12kb",
      image: require("../../images/file-manager/document-preview-1.jpg"),
      selected: false
    },
    {
      id: 2,
      title: "Lorem Ipsum Document",
      size: "12kb",
      image: require("../../images/file-manager/document-preview-1.jpg"),
      selected: false
    },
    {
      id: 3,
      title: "Lorem Ipsum Document",
      size: "12kb",
      image: require("../../images/file-manager/document-preview-1.jpg"),
      selected: false
    },
    {
      id: 4,
      title: "Lorem Ipsum Document",
      size: "12kb",
      image: require("../../images/file-manager/document-preview-1.jpg"),
      selected: false
    }
  ]
};

export default ComponentName;
