import React from "react";
import { connect } from "react-redux";
import {
  Form,
  FormGroup,
  FormText,
  Input,
  CustomInput,
  Button,
  Label,
  EmptyLayout,
  ThemeConsumer
} from "./../../../components";

function Profile({ userInfo }) {
  return (
    <EmptyLayout>
      <EmptyLayout.Section center></EmptyLayout.Section>
    </EmptyLayout>
  );
}

const mapStateToProps = state => {
  return {
    userinfo: state.authReducer.userinfo
  };
};
export default connect(mapStateToProps, null)(Profile);
