import { UserInterfaceSettingsType } from "MST/interfaceSettings";

export interface RegisterFormInterface {
  userName: string;
  userEmail: string;
  userPassword: string;
}

export interface LoginFormInterface {
  userEmail: string;
  userPassword: string;
}

export type AuthenticatedUserType =
  | LoginFormInterface
  | RegisterFormInterface
  | {
      userToken: string;
      userIsAuthenticated: boolean;
      userInterface: UserInterfaceSettingsType;
    };
