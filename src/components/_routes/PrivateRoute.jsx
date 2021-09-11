import { Route, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { userSelectors } from "../../redux/user/user-selectors";

const PrivateRoute = ({ component: Component, ...routeProps }) => {
  const isAuthenticated = useSelector(userSelectors.isAuthenticated);
  return (
    <Route
      {...routeProps}
      render={(props) => {
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default PrivateRoute;
