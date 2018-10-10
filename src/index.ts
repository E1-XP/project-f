import { initApp } from "./lib";

import { initialState } from "./store";

import { App } from "./app";

import "./scss/main.scss";

const appInit = () => {
  const root: any = document.getElementById("root");

  initApp(<any>App, root, initialState);
};

document.addEventListener("DOMContentLoaded", appInit);
