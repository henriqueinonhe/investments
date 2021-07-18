declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}

export interface Theme {
  primaryColor : string;
}

export const lightTheme : Theme = {
  primaryColor: "#91a7ff"
};