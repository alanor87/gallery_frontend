import { lazy } from "react";

const LoginRegisterView = lazy(() => import("./views/LoginRegister"));
const GalleryView = lazy(() => import("./views/Gallery"));

const routes = [
  {
    isPublic: true,
    path: "/login",
    redirectTo: "/userGallery",
    exact: true,
    restricted: true,
    component: LoginRegisterView,
    label: "LoginView",
  },
  {
    isPublic: true,
    path: "/register",
    redirectTo: "/userGallery",
    exact: true,
    restricted: true,
    component: LoginRegisterView,
    label: "RegisterView",
  },
  {
    isPublic: false,
    path: "/userGallery",
    redirectTo: "/login",
    exact: false,
    restricted: false,
    component: GalleryView,
    label: "userGallery",
  },
  {
    isPublic: false,
    path: "/sharedGallery",
    redirectTo: "/login",
    exact: false,
    restricted: false,
    component: GalleryView,
    label: "sharedGallery",
  },
  {
    isPublic: true,
    path: "/publicGallery",
    redirectTo: "/login",
    exact: false,
    restricted: false,
    component: GalleryView,
    label: "publicGallery",
  },
  // {
  //   isPublic: false,
  //   path: "/image/:id",
  //   redirectTo: "/login",
  //   exact: false,
  //   restricted: false,
  //   component: ModalImageView,
  //   label: "ModalImageView",
  // },
];

export interface RouterPropsType {
  component: any;
  redirectTo: string;
  children?: JSX.Element | React.FC;
  path: string;
  restricted: boolean;
  exact: boolean;
  label: string;
}

export default routes;
