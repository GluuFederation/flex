module.exports = {
    root: true,
    parser: 'babel-eslint',
    plugins: [
        "react"
    ],
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true
        }
    },
    env: {
        es6:     true,
        browser: true,
        node:    true,
        mocha:   true
    },   
    extends: [
        "eslint:recommended", 
        "plugin:react/recommended"
    ],    
    rules: {
        "no-var": "error",
        "semi": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
        "prefer-const": "error",
        "no-unused-vars": "off",
        //"no-use-before-define": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        'object-curly-spacing': ['error', 'always'],
        "react/jsx-curly-spacing": [ 0, "always" ],
        'generator-star-spacing': 'off',
        "space-in-parens": ["error", "never"],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "indent": ["error", 2, {"ignoredNodes": ["JSXElement"]}],
        "react/jsx-indent": ["error", 2],
        "react/jsx-indent-props": ["error", 2],
        "react/display-name": [ 0, { "ignoreTranspilerName": false } ]
    },
    overrides: [
        {
          files: ['*.js', '*.jsx'],
          rules: {
            "react/prop-types": "off"
          }
        }
    ],
    settings: {
        react: {
            version: "detect"
        }
    }
}
