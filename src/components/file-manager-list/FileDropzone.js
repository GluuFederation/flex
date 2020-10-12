import React from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";

class FileDropzone extends React.Component {
  constructor(props) {
    super(props);

    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  /**
   * Mock method to handle the file drop.
   */
  handleFileDrop(val) {
    alert(`You've dropped ${val.length} file${val.length > 1 ? "s" : ""}`);
  }

  render() {
    return (
      <div className="file-manager__dropzone">
        <Dropzone onDrop={this.handleFileDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div
                {...getRootProps()}
                className={classNames("dropzone", {
                  "dropzone--isActive": isDragActive
                })}
              >
                <input {...getInputProps()} />
                <span>
                  {isDragActive
                    ? "Drop files here!"
                    : "Drop files here to upload"}
                </span>
              </div>
            );
          }}
        </Dropzone>
      </div>
    );
  }
}

export default FileDropzone;
