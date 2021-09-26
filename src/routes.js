import { lazy } from 'react';

const LoginView = lazy(() => import('./views/Login'));
const RegisterView = lazy(() => import('./views/Register'));
const GalleryView = lazy(() => import('./views/Gallery'));

const routes = [
    {
        isPublic: true,
        path: '/login',
        redirectTo: '/gallery',
        exact: true,
        restricted: true,
        component: LoginView,
        label: 'LoginView',
    },
    {
        isPublic: true,
        path: '/register',
        redirectTo: '/gallery',
        exact: true,
        restricted: true,
        component: RegisterView,
        label: 'RegisterView',
    },
    {
        isPublic: false,
        path: '/gallery',
        redirectTo: '/login',
        exact: false,
        restricted: false,
        component: GalleryView,
        label: 'GalleryView',
    },
];

export default routes;