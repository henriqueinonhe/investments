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
    domain={process.env.AUTH0_DOMAIN!}
    clientId={process.env.AUTH0_CLIENT_ID!}
    redirectUri={window.location.origin}
    audience={process.env.AUTH0_AUDIENCE!}
  >
    <App />
  </Auth0Provider>, 
  rootNode
);