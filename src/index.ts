import { run, renderToDOM } from "./lib";
import { container } from "./lib/IOC";
import { types } from "./lib/IOC/types";

import { Model } from "./lib/model";

import { initialState } from "./store";

import { App } from "./app";

import "./scss/main.scss";

const appInit = () => {
  // const state = { name: "okkk" };
  // render(template(state), <any>document.getElementById("root"));
  const model = container.get<Model>(types.Model);
  model.createStore(initialState);

  // const app = new App(model);
  const root: any = document.getElementById("root");
  // const x = document.createDocumentFragment();
  // x.appendChild(document.createTextNode("ok2"));

  root.innerHTML = "";
  // root.appendChild(x);
  // renderToDOM(App, document.getElementById("root"));
  root.innerHTML = run(App);
};

document.addEventListener("DOMContentLoaded", appInit);
