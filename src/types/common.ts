export interface ImageOpenedToUserEntry {
  name: string;
  action: "add" | "remove" | "none";
}

export interface RouterPropsType {
  component: any;
  redirectTo: string;
  children?: JSX.Element | React.FC;
  path: string;
  restricted: boolean;
  exact: boolean;
  label: string;
}
