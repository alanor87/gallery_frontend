import { Route, Redirect } from "react-router";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";

const PublicRoute = ({
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
        return !userIsAuthenticated && routeProps.restricted ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirectTo} />
        );
      }}
    />
  );
};

export default observer(PublicRoute);
