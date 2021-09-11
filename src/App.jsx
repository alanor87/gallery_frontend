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
import { fetchImages } from "./redux/gallery/gallery-operations";
import { useDispatch } from "react-redux";
import store from "./MST/store";

function App() {
  const { lightThemeIsOn, authModalIsOpen, toggleAuthModal } =
    store.interfaceSettings;

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchImages()), [dispatch]);
  
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
