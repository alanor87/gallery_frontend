export interface RegisterFormInterface {
  userName: string;
  userEmail: string;
  userPassword: string;
}

export interface LoginFormInterface {
  userEmail: string;
  userPassword: string;
}

export interface UserInterfaceSettings {
  backgroundImage: string;
  lightThemeIsOn: boolean;
  imagesPerPage: number;
  sidePanelIsOpen: boolean;
}

type AuthenticatedUserType =
  | LoginFormInterface
  | RegisterFormInterface
  | {
      userToken: string;
      userIsAuthenticated: boolean;
      userInterface: UserInterfaceSettings;
    };

export default AuthenticatedUserType;
