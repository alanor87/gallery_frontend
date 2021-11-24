import { useEffect } from "react";
import { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "axios";
import PrivateRoute from "./components/_routes/PrivateRoute";
import PublicRoute from "./components/_routes/PublicRoute";
import AppBar from "./components/AppBar";
import { Spinner } from "./components/elements";
import routes from "./routes";
import store from "./MST/store";
import { ToggleButton } from "./components/elements";

function App() {
  useEffect(() => {
    store.localTokenInit();
  }, []);

  const { userSettings, backendToggle } = store;

  const { lightThemeIsOn } = userSettings.userInterface;
  const { userIsAuthenticated } = userSettings;

  useEffect(() => {
    if (lightThemeIsOn) document.body.classList.add("AppLightTheme");
    if (!lightThemeIsOn) document.body.classList.remove("AppLightTheme");
  }, [lightThemeIsOn]);

  return (
    <div className={"appMain"}>
      {userIsAuthenticated && <AppBar />}
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
                  />
                ) : (
                  <PrivateRoute
                    key={label}
                    path={path}
                    redirectTo={redirectTo}
                    exact={exact}
                    restricted={restricted}
                    component={component}
                  />
                )
            )}
            <Redirect to={userIsAuthenticated ? "/gallery" : "/login"} />
          </Switch>
        </Suspense>
        <ToggleButton
          hint={axios.defaults.baseURL}
          style={{ position: "absolute", bottom: "10px", right: "10px" }}
          toggleHandler={backendToggle}
        />
      </main>
    </div>
  );
}

export default observer(App);
