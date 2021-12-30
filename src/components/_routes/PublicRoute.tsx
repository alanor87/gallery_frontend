import React from "react";
import { Route, Redirect } from "react-router";
import { observer } from "mobx-react-lite";
import { RouterPropsType } from "../../types/common";
import store from "../../MST/store";

const PublicRoute: React.FC<RouterPropsType> = ({
  component: Component,
  redirectTo,
  children,
  label,
  ...routeProps
}) => {
  const { userIsAuthenticated } = store.userSettings;
  return (
    <Route
      {...routeProps}
      render={(props) => {
        return !userIsAuthenticated || !routeProps.restricted ? (
          <Component label={label} path={routeProps.path} />
        ) : (
          <Redirect to={redirectTo} />
        );
      }}
    />
  );
};

export default observer(PublicRoute);
