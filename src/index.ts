import { initApp } from "./lib";

import { initialState } from "./store";
import routes from "./routes";

import { App } from "./app";

import "./scss/main.scss";

const appInit = () => {
  initApp(<any>App, document.getElementById("root")!, routes, initialState);
};

document.addEventListener("DOMContentLoaded", appInit);
