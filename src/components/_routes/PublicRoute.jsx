import { Route, Redirect } from "react-router";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";

const PublicRoute = ({ component: Component, ...routeProps }) => {
  const { userIsAuthenticated } = store.userSettings;
  return (
    <Route
      {...routeProps}
      render={(props) => {
        return !userIsAuthenticated && routeProps.isRestricted ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

export default observer(PublicRoute);
