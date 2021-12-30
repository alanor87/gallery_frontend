import { useEffect } from "react";
import { Suspense } from "react";
import { Switch, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import axios from "axios";
import PrivateRoute from "./components/_routes/PrivateRoute";
import PublicRoute from "./components/_routes/PublicRoute";
import AppBar from "./components/AppBar";
import SideMenu from "./components/SideMenu";
import { ToggleButton, Spinner } from "./components/elements";
import routes from "./routes";
import store from "./MST/store";

function App() {
  useEffect(() => {
    console.log("App useEffect");
    store.publicSettingsInit();
    if (
      localStorage.getItem("token") &&
      !store.userSettings.userIsAuthenticated
    )
      store.localTokenInit();
  }, []);

  const { userSettings, backendToggle } = store;

  const { lightThemeIsOn, sidePanelIsOpen } = userSettings.userInterface;
  const { userIsAuthenticated } = userSettings;

  useEffect(() => {
    if (lightThemeIsOn) document.body.classList.add("AppLightTheme");
    if (!lightThemeIsOn) document.body.classList.remove("AppLightTheme");
  }, [lightThemeIsOn]);

  /*
   * If there's a token in localStorage on the initial page load / page reload  -
   * the next lines prevent the login page flicker, showing spinner instead.
   */
  if (localStorage.getItem("token") && !store.userSettings.userIsAuthenticated)
    return <Spinner text="Checking token" side={100} />;

  console.log("App render");
  return (
    <div className={"appMain"}>
      <AppBar />
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
