import { Route, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { userSelectors } from "../../redux/user/user-selectors";

const PublicRoute = ({ component: Component, ...routeProps }) => {
  const isAuthenticated = useSelector(userSelectors.isAuthenticated);
  return (
    <Route
      {...routeProps}
      render={(props) => {
        return !isAuthenticated && routeProps.isRestricted ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

export default PublicRoute;
