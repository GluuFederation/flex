import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Row, Col, Card, CardFooter } from "shards-react";

class DirectoriesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props
    };

    this.handleDirectoryClick = this.handleDirectoryClick.bind(this);
  }

  /**
   * Changes the selected state for a specific (clicked) directory.
   */
  handleDirectoryClick(dir) {
    const newState = { ...this.state };
    this.setState({
      ...(newState.directories[newState.directories.indexOf(dir)] = {
        ...dir,
        selected: !dir.selected
      })
    });
  }

  render() {
    const { directories } = this.state;
    return (
      <Row>
        {directories.map((dir, idx) => {
          const classes = classNames(
            dir.selected && "file-manager__item--selected",
            "file-manager__item",
            "file-manager__item--directory",
            "mb-3"
          );

          return (
            <Col lg="3" key={idx}>
              <Card
                onClick={() => this.handleDirectoryClick(dir)}
                small
                className={classes}
              >
                <CardFooter>
                  <span className="file-manager__item-icon">
                    <i className="material-icons">&#xE2C7;</i>{" "}
                  </span>
                  <h6 className="file-manager__item-title">{dir.title}</h6>
                </CardFooter>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  }
}
DirectoriesList.propTypes = {
  /**
   * The directories array.
   */
  directories: PropTypes.array
};

DirectoriesList.defaultProps = {
  directories: [
    {
      id: 1,
      title: "Projects",
      selected: true
    },
    {
      id: 2,
      title: "Movies",
      selected: false
    },
    {
      id: 3,
      title: "Backups",
      selected: false
    },
    {
      id: 4,
      title: "Photos",
      selected: false
    },
    {
      id: 5,
      title: "Old Files",
      selected: false
    },
    {
      id: 6,
      title: "New Folder with Extremely Long Title",
      selected: false
    }
  ]
};

export default DirectoriesList;
