import React, {createContext} from 'react';

export const AppContext = createContext('');
export const withAppContext = (Component: any, mapStateToProp: any = null) => {
  const ConsumableComponent = (props: any) => {
    return (
      <AppContext.Consumer>
        {state => {
          const mappedProps = mapStateToProp ? mapStateToProp(state) : state;
          const mergedProps = {...props, ...mappedProps};
          return <Component {...mergedProps} />;
        }}
      </AppContext.Consumer>
    );
  };
  return ConsumableComponent;
};
