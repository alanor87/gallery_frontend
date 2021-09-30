import React from "react";
import { Route, Redirect } from "react-router";
import { observer } from "mobx-react-lite";
import { RouterPropsType } from "../../routes";
import store from "../../MST/store";

const PrivateRoute: React.FC<RouterPropsType> = ({
  component: Component,
  redirectTo,
  children,
  ...routeProps
}) => {
  const { userIsAuthenticated } = store.userSettings;
  return (
    <Route
      {...routeProps}
      render={(props) => {
        return userIsAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirectTo} />
        );
      }}
    />
  );
};

export default observer(PrivateRoute);