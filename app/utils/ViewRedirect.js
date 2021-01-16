import React from "react";
import { Container } from "./../components";

function ViewRedirect() {
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
        </div>
      </Container>
    </React.Fragment>
  );
}
export default ViewRedirect;
