import { lazy } from "react";

const LoginRegisterView = lazy(() => import("./views/LoginRegister"));
const GalleryView = lazy(() => import("./views/Gallery"));
const ModalImageView = lazy(() => import("./views/ModalImage"));

const routes = [
  {
    isPublic: true,
    path: "/login",
    redirectTo: "/gallery",
    exact: true,
    restricted: true,
    component: LoginRegisterView,
    label: "LoginView",
  },
  {
    isPublic: true,
    path: "/register",
    redirectTo: "/gallery",
    exact: true,
    restricted: true,
    component: LoginRegisterView,
    label: "RegisterView",
  },
  {
    isPublic: false,
    path: "/gallery",
    redirectTo: "/login",
    exact: false,
    restricted: false,
    component: GalleryView,
    label: "GalleryView",
  },
  {
    isPublic: false,
    path: "/image/:id",
    redirectTo: "/login",
    exact: false,
    restricted: false,
    component: ModalImageView,
    label: "ModalImageView",
  },
];

export interface RouterPropsType {
  component: any;
  redirectTo: string;
  children?: JSX.Element | React.FC;
  path: string;
  restricted: boolean;
  exact: boolean;
}

export default routes;
