import React from "react";
import { Container, Label } from "./../components";

function ViewRedirect(config) {
  return (
    <React.Fragment>
      <Container>
        <div
          style={{
            backgroundColor: "white",
            margin: "auto",
            marginTop: "20%"
          }}
        >
          <img
            style={{
              display: "block",
              marginLeft: "auto",
              marginTop: "auto",
              marginRight: "auto",
              width: "100%",
              height: "100%"
            }}
            src={require("../images/gif/npe-redirecting.gif")}
            alt="loading..."
          />
          {!config && (
            <Label sm={12}>
              An error occurs while fetching the user authentication server
              configuration! Make sure the Backend Ui is up and running.
            </Label>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
}
export default ViewRedirect;
