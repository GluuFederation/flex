import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Nav, Collapse } from "shards-react";

import { Store } from "../../../flux";
import MenuItem from "./MenuItem";

class HeaderNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false
    };

    this.onChange = this.onChange.bind(this);
  }


  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      menuVisible: Store.getMenuState(),
    });
  }

  render() {
    const { items } = this.props;
    return (
      <Collapse className="header-navbar d-lg-flex p-0 bg-white border-top" open={this.state.menuVisible}>
        <Container>
          <Row>
            <Col>
              <Nav tabs className="border-0 flex-column flex-lg-row">
                {items.map((item, idx) => (
                  <MenuItem key={idx} item={item} />
                ))}
              </Nav>
            </Col>
          </Row>
        </Container>
      </Collapse>
    );
  }
}


HeaderNavbar.propTypes = {
  items: PropTypes.array
};

export default HeaderNavbar;
