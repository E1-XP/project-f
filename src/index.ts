import { initApp } from "./lib";

import { initialState } from "./store";
import routes from "./routes";

import { App } from "./app";

import "./scss/main.scss";

const appInit = () => {
  const root = document.getElementById("root");

  if (!root) throw new Error(`can't find specified node`);

  initApp(<any>App, root, routes, initialState);
};

document.addEventListener("DOMContentLoaded", appInit);
