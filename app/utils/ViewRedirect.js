import React, { useEffect } from "react";
import { Container, Label, Alert, Media } from "./../components";

function ViewRedirect(props) {
  console.log("-------- " + JSON.stringify(props.config));
  useEffect(() => {
    const interval = setInterval(() => {
      props.getOAuth2Config();
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, []);
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
          {!props.config.hasOwnProperty("clientId") && (
            <Alert color="danger">
              <Media>
                <Media left middle className="mr-3">
                  <span className="fa-stack fa-lg">
                    <i className="fa fa-circle fa-fw fa-stack-2x alert-bg-icon"></i>
                    <i className="fa fa-close fa-stack-1x fa-inverse alert-icon"></i>
                  </span>
                </Media>
                <Media
                  body
                  style={{
                    textAlign: "center"
                  }}
                >
                  <h6
                    className="alert-heading mb-1"
                    style={{
                      textAlign: "center",
                      color: "#FF9333",
                      fontWeight: "bold"
                    }}
                  >
                    Error fetching server configuration!
                  </h6>
                  An error occurs while fetching the user authentication server
                  configuration! Make sure the Backend Ui is up and running.
                </Media>
              </Media>
            </Alert>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
}
export default ViewRedirect;
