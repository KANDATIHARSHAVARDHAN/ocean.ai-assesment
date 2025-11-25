import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";
import App from "./App";

const container = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


