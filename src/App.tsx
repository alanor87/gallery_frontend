import { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router";
import { Switch, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "axios";
import PrivateRoute from "./components/_routes/PrivateRoute";
import PublicRoute from "./components/_routes/PublicRoute";
import AppBar from "./components/AppBar";
import Pagination from "./components/Pagination";
import SideMenu from "./components/SideMenu";
import { Spinner } from "./components/elements";
import routes from "./routes";
import store from "./MST/store";

function App() {
  console.log("App render");
  const {
    userSettings,
    publicSettingsInit,
    localTokenInit,
    setCurrentWindowWidth,
    backendUrl,
    setBackendUrl,
  } = store;
  const { userIsAuthenticated } = userSettings;
  const { lightThemeIsOn, sidePanelIsOpen } = userSettings.userInterface;

  const location = useLocation();

  const [isAuthRoute, setIsAuthRoute] = useState(true);

  useEffect(() => {
    console.log("setting axios default backend url : ", backendUrl);
    axios.defaults.baseURL = backendUrl;
  }, [backendUrl]);

  useEffect(() => {
    window.onresize = () => {
      setCurrentWindowWidth(window.innerWidth);
    };
    return () => {
      window.onresize = null;
    };
  }, [setCurrentWindowWidth]);

  useEffect(() => {
    if (localStorage.getItem("token") && !userIsAuthenticated) localTokenInit();
  }, [localTokenInit, publicSettingsInit, userIsAuthenticated]);

  useEffect(() => {
    setIsAuthRoute(["/login", "/register"].includes(location.pathname));
  }, [location]);

  useEffect(() => {
    lightThemeIsOn
      ? document.body.classList.add("AppLightTheme")
      : document.body.classList.remove("AppLightTheme");
  }, [lightThemeIsOn]);

  const backendToggle = () => {
    const newBackendURL =
      backendUrl === "http://localhost:3030/api/v1"
        ? "https://gallery-app-mj.herokuapp.com/api/v1"
        : "http://localhost:3030/api/v1";
    setBackendUrl(newBackendURL);
  };

  /*
   * If there's a token in localStorage on the initial page load / page reload  -
   * the next lines prevent the login page flicker, showing spinner instead.
   */
  if (localStorage.getItem("token") && !store.userSettings.userIsAuthenticated)
    return <Spinner text="Checking token" side={100} />;

  return (
    <div className={"appMain"}>
      {!isAuthRoute && (
        <AppBar searchBar={location.pathname !== "/singleImage"} />
      )}
      {userIsAuthenticated && <SideMenu isOpen={sidePanelIsOpen} />}
      <main className="mainSection">
        <Suspense fallback={<Spinner side={100} />}>
          {" "}
          <Switch>
            {routes.map(
              ({
                label,
                redirectTo,
                isPublic,
                path,
                exact,
                restricted,
                component,
              }) =>
                isPublic ? (
                  <PublicRoute
                    key={label}
                    path={path}
                    redirectTo={redirectTo}
                    exact={exact}
                    restricted={restricted}
                    component={component}
                    label={label}
                  />
                ) : (
                  <PrivateRoute
                    key={label}
                    path={path}
                    redirectTo={redirectTo}
                    exact={exact}
                    restricted={restricted}
                    component={component}
                    label={label}
                  />
                )
            )}
            <Redirect to={userIsAuthenticated ? "/userGallery" : "/login"} />
          </Switch>
        </Suspense>
        {!isAuthRoute && <Pagination />}
      </main>
      {backendUrl}
    </div>
  );
}

export default observer(App);
