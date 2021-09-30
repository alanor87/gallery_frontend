import React from "react";
import { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import PrivateRoute from "./components/_routes/PrivateRoute";
import PublicRoute from "./components/_routes/PublicRoute";
import AppBar from "./components/AppBar";
import { useEffect } from "react";
import routes from "./routes";
import store from "./MST/store";

function App() {
  const { interfaceSettings, imagesStoreSettings, userSettings } = store;

  useEffect(() => {
    imagesStoreSettings.fetchImages();
    interfaceSettings.fetchInterfaceSettings();
  }, [imagesStoreSettings, interfaceSettings]);

  const { lightThemeIsOn } = interfaceSettings;
  const { userIsAuthenticated } = userSettings;

  useEffect(() => {
    if (lightThemeIsOn) document.body.classList.add("AppLightTheme");
    if (!lightThemeIsOn) document.body.classList.remove("AppLightTheme");
  }, [lightThemeIsOn]);

  return (
    <div className={"appMain"}>
      <AppBar />
      <main className="mainSection">
        <Suspense fallback={<div>Loading ...</div>}>
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
      </main>
    </div>
  );
}

export default observer(App);
