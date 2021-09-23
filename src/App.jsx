import { Route } from "react-router-dom";
import { observer } from "mobx-react-lite";
import PrivateRoute from "./components/_routes/PrivateRoute";
import PublicRoute from "./components/_routes/PublicRoute";
import AppBar from "./components/AppBar";
import LoginView from "./views/Login/Login";
import GalleryPage from "./views/Gallery";
import ImageDetails from "./views/ImageDetails";
import Modal from "./components/Modals/Modal";
import ModalAuth from "./components/Modals/ModalAuth";
import { useEffect } from "react";
import store from "./MST/store";

function App() {
  const { interfaceSettings, imagesStoreSettings } = store;
  const { lightThemeIsOn, authModalIsOpen, toggleAuthModal } =
    interfaceSettings;

  useEffect(() => imagesStoreSettings.fetchImages(), [imagesStoreSettings]);

  useEffect(() => {
    if (lightThemeIsOn) document.body.classList.add("AppLightTheme");
    if (!lightThemeIsOn) document.body.classList.remove("AppLightTheme");
  }, [lightThemeIsOn]);

  const authModalOpenHandle = () => {
    toggleAuthModal(true);
  };

  return (
    <div>
      <AppBar onAuthModalOpen={authModalOpenHandle} />
      <main className="section-gallery">
        <Route exact path="/" component={GalleryPage} />
        <PrivateRoute path="/image/:id" component={ImageDetails} />
        <PublicRoute exact isRestricted path="/login" component={LoginView} />
      </main>
      {authModalIsOpen && <Modal component={ModalAuth} />}
    </div>
  );
}

export default observer(App);
