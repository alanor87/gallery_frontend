import { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import PrivateRoute from "./components/_routes/PrivateRoute";
import PublicRoute from "./components/_routes/PublicRoute";
import AppBar from "./components/AppBar";
import { ToggleButton, Spinner } from "./components/elements";
import { useEffect } from "react";
import routes from "./routes";
import store from "./MST/store";

function App() {
  const { interfaceSettings, userSettings } = store;

  useEffect(() => {
    interfaceSettings.fetchGetInterfaceSettings();
  }, [interfaceSettings]);

  const { lightThemeIsOn } = interfaceSettings;
  const { userIsAuthenticated } = userSettings;

  useEffect(() => {
    if (lightThemeIsOn) document.body.classList.add("AppLightTheme");
    if (!lightThemeIsOn) document.body.classList.remove("AppLightTheme");
  }, [lightThemeIsOn]);

  const toggleAuthHandler = (value: boolean) => {
    store.userSettings.toggleUserIsAuthenticated(value);
  };

  return (
    <div className={"appMain"}>
      <AppBar />
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
          style={{ position: "absolute", top: "90%", left: "90%" }}
          toggleHandler={toggleAuthHandler}
          isChecked={userIsAuthenticated}
          hint="LogIn / LogOut"
        />
      </main>
    </div>
  );
}

export default observer(App);
