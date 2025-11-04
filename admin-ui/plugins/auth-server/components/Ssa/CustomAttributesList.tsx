import React from 'react'
import type { CustomAttributesListProps } from './types'

const CustomAttributesList: React.FC<CustomAttributesListProps> = ({
  availableAttributes,
  selectedAttributes,
  onAttributeSelect,
  searchQuery,
  searchInputValue,
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
        value={searchInputValue}
        aria-label="Search custom attributes"
      />
      <ul className="list-group" aria-label="Available custom attributes for SSA">
        {availableAttributes
          .filter((attribute) => {
            const name = attribute.toLowerCase()
            const alreadyAdded = selectedAttributes.includes(attribute)
            return (name.includes(searchQuery.toLowerCase()) || !searchQuery) && !alreadyAdded
          })
          .map((attribute) => (
            <li className="list-group-item" key={attribute}>
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => onAttributeSelect(attribute)}
                title="Click to add to the form"
                aria-label={`Add ${attribute} attribute to form`}
              >
                {attribute}
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}

CustomAttributesList.displayName = 'CustomAttributesList'

export default CustomAttributesList
