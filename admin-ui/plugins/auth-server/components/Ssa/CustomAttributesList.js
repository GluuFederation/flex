import React from "react";
import PropTypes from "prop-types";

const CustomAttributesList = ({
  availableAttributes,
  selectedAttributes,
  onAttributeSelect,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="border border-light">
      <div className="bg-light text-bold p-2">Available Custom Attributes</div>
      <input
        type="search"
        className="form-control mb-2"
        placeholder="Search Attribute Here"
        onChange={(e) => onSearchChange(e.target.value)}
        value={searchQuery}
        aria-label="Search custom attributes"
      />
      <ul className="list-group" role="listbox">
        {availableAttributes.map((attribute) => {
          const name = attribute.toLowerCase();
          const alreadyAdded = selectedAttributes.includes(attribute);

          if (
            (name.includes(searchQuery.toLowerCase()) || !searchQuery) &&
            !alreadyAdded
          ) {
            return (
              <li
                className="list-group-item"
                key={attribute}
                role="option"
                aria-selected={false}
              >
                <button
                  className="btn btn-link p-0"
                  onClick={() => onAttributeSelect(attribute)}
                  title="Click to add to the form"
                >
                  {attribute}
                </button>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};

CustomAttributesList.propTypes = {
  availableAttributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedAttributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAttributeSelect: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default CustomAttributesList;
