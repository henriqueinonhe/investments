import React from "react";
import ReactDOM from "react-dom";

function App() : JSX.Element {
  return <>Hello World!</>;
}

const body = document.querySelector("body")!;
const rootNode = document.createElement("div")!;
body.appendChild(rootNode);

ReactDOM.render(<App />, rootNode);