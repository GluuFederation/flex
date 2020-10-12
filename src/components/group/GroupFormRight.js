import React, { useState } from "react";
import PropTypes from "prop-types";
import { AutoComplete } from "primereact/autocomplete";
import { Card, CardHeader, ListGroup, ListGroupItem, Row } from "shards-react";
import '../../css/theme.css'
import 'primereact/resources/primereact.min.css'

const GroupFormRight = ({ title, users }) => {
  const [user, setUser] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  function suggestUser(event) {
    let results = users.filter(user => {
      return user.toLowerCase().includes(event.query.toLowerCase());
    });
    setSuggestions(results);
  }
  return (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <AutoComplete
              value={user}
              onChange={e => setUser(e.value)}
              suggestions={suggestions}
              completeMethod={suggestUser}
              placeholder="Start typing to select a user"
            />
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

GroupFormRight.propTypes = {
  title: PropTypes.string
};

GroupFormRight.defaultProps = {
  title: "Select users"
};
export default GroupFormRight;
