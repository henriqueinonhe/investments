import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./helpers/i18n";
import { Auth0Provider } from "@auth0/auth0-react";

const body = document.querySelector("body")!;
const rootNode = document.createElement("div")!;
rootNode.id = "root";
body.appendChild(rootNode);

ReactDOM.render(
  <Auth0Provider
    domain="dev-8z6e9jdt.us.auth0.com" //Extract to environment variable
    clientId="YEaR72do24paH1U54sRCDRIta8XYai02" //Extract to environment variable
    redirectUri={window.location.origin}
    audience="Investments API"
  >
    <App />
  </Auth0Provider>, 
  rootNode
);