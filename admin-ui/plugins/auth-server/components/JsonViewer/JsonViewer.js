import React from 'react';
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import './JsonViewer.css';
import PropTypes from 'prop-types';
const JsonViewer = ({ 
  data, 
  theme = 'light',
  expanded = true,
  style = {},
  className = ''
}) => {
  const styles = theme === 'dark' ? darkStyles : defaultStyles;
  const shouldExpand = expanded ? allExpanded : undefined;
  return (
    <div 
      className={`json-viewer ${className}`}
      style={{
        padding: '1rem',
        borderRadius: '4px',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        ...style
      }}
    >
      <JsonView 
        data={data} 
        style={styles}
        shouldExpandNode={shouldExpand}
      />
    </div>
  );
};

JsonViewer.propTypes = {
  data: PropTypes.object.isRequired,
  theme: PropTypes.string,
  expanded: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string
};

export default JsonViewer;