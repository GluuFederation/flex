import React from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import { Row } from "shards-react";

class DropzoneArea extends React.Component {
  constructor(props) {
    super(props);

    this.handleDrop = this.handleDrop.bind(this);
  }

  /**
   * Mock method to handle the file(s) drop action.
   */
  handleDrop(val) {
    alert(`You've dropped ${val.length} file${val.length > 1 ? "s" : ""}`);
  }

  render() {
    return (
      <Row noGutters className="border-bottom">
        <div className="file-manager-cards__dropzone w-100 p-2">
          <Dropzone onDrop={this.handleDrop}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              return (
                <div
                  {...getRootProps()}
                  className={classNames("dropzone", {
                    "dropzone--isActive": isDragActive
                  })}
                >
                  <input {...getInputProps()} />
                  <p className="m-0">
                    {isDragActive
                      ? "Drop files here..."
                      : "Try dropping some files here, or click to select files to upload."}
                  </p>
                </div>
              );
            }}
          </Dropzone>
        </div>
      </Row>
    );
  }
}

export default DropzoneArea;
