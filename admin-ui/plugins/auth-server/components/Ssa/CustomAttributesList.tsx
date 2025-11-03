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
      <ul
        className="list-group"
        role="listbox"
        aria-label="Available custom attributes for SSA"
        aria-multiselectable="false"
      >
        {availableAttributes.map((attribute) => {
          const name = attribute.toLowerCase()
          const alreadyAdded = selectedAttributes.includes(attribute)

          if ((name.includes(searchQuery.toLowerCase()) || !searchQuery) && !alreadyAdded) {
            return (
              <li className="list-group-item" key={attribute} role="option" aria-selected={false}>
                <button
                  className="btn btn-link p-0"
                  onClick={() => onAttributeSelect(attribute)}
                  title="Click to add to the form"
                  aria-label={`Add ${attribute} attribute to form`}
                >
                  {attribute}
                </button>
              </li>
            )
          }
          return null
        })}
      </ul>
    </div>
  )
}

CustomAttributesList.displayName = 'CustomAttributesList'

export default CustomAttributesList
