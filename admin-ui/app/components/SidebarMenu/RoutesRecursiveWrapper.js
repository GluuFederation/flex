import React from 'react'
import { Route } from 'react-router'

export const RoutesRecursiveWrapper = ({ item }) => {

    const { path, children = [], component } = item;
    
    return (
         children.length > 0 ? (

            children.map((child, i) => (<RoutesRecursiveWrapper key={i} item={child} />))

        ) : (!!path &&
            <Route  component={component} path={path} />
            )
    );

};
