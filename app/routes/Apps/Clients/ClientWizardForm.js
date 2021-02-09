import React, { useState } from "react";
import {
  Container,
  Wizard,
  Card,
  CardFooter,
  CardBody,
  Button
} from "../../../components";
import ClientBasic from "./ClientBasicPanel";
import ClientAdvanced from "./ClientAdvancedPanel";
import ClientEncryption from "./ClientEncryptionPanel";
const sequence = ["Basic", "Advanced", "Encryption"];
function ClientWizardForm() {
  const [currentStep, setCurrentStep] = useState(sequence[0]);

  function changeStep(stepId) {
    setCurrentStep(stepId);
  }
  function setId(index) {
    return sequence[index];
  }

  function prevStep() {
    setCurrentStep(sequence[sequence.indexOf(currentStep) - 1]);
  }

  function nextStep() {
    setCurrentStep(sequence[sequence.indexOf(currentStep) + 1]);
  }

  function isComplete(stepId) {
    return sequence.indexOf(stepId) < sequence.indexOf(currentStep);
  }

  return (
    <Container>
      <Card>
        <CardBody className="d-flex justify-content-center pt-5">
          <Wizard activeStep={currentStep} onStepChanged={changeStep}>
            <Wizard.Step
              id={setId(0)}
              icon={<i className="fa fa-shopping-basket fa-fw"></i>}
              complete={isComplete(sequence[0])}
            >
              Basic
            </Wizard.Step>
            <Wizard.Step
              id={setId(1)}
              icon={<i className="fa fa-cube fa-fw"></i>}
              complete={isComplete(sequence[1])}
            >
              Advanced
            </Wizard.Step>
            <Wizard.Step
              id={setId(2)}
              icon={<i className="fa fa-credit-card fa-fw"></i>}
              complete={isComplete(sequence[2])}
            >
              Encryption
            </Wizard.Step>
          </Wizard>
        </CardBody>
        <CardBody className="p-5">
          {(() => {
            switch (currentStep) {
              case sequence[0]:
                return <ClientBasic />;
              case sequence[1]:
                return <ClientAdvanced />;
              case sequence[2]:
                return <ClientEncryption />;
            }
          })()}
        </CardBody>
        <CardFooter className="p-4 bt-0">
          <div className="d-flex">
            {currentStep !== sequence[0] && (
              <Button
                type="button"
                onClick={prevStep}
                color="link"
                className="mr-3"
              >
                <i className="fa fa-angle-left mr-2"></i>
                Previous
              </Button>
            )}
            {currentStep !== sequence[sequence.length - 1] && (
              <Button
                type="button"
                color="primary"
                onClick={nextStep}
                className="ml-auto px-4"
              >
                Next
                <i className="fa fa-angle-right ml-2"></i>
              </Button>
            )}
            {currentStep === sequence[sequence.length - 1] && (
              <Button type="submit" color="primary" className="ml-auto px-4">
                Submit
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
}

export default ClientWizardForm;
