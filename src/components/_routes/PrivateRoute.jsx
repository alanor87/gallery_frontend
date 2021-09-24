import { Route, Redirect } from "react-router";
import { observer } from "mobx-react-lite";
import store from "../../MST/store";

const PrivateRoute = ({ component: Component, ...routeProps }) => {
  const { userIsAuthenticated } = store.userSettings;
  return (
    <Route
      {...routeProps}
      render={(props) => {
        return userIsAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default observer(PrivateRoute);
