import { injectable } from "inversify";

import { container } from "./IOC";
import { types } from "./IOC/types";
import { Model } from "./model";

import { State } from "./../store";

export interface IRoutes {
  [key: string]: () => Partial<State>;
}

@injectable()
export class Router {
  routes: IRoutes = {};

  constructor() {
    this.onHistoryPop();
  }

  onHistoryPop() {
    const model = container.get<Model>(types.Model);

    window.onpopstate = () =>
      model.setState(this.routes[window.location.pathname]());
  }

  registerRoutes(routes: IRoutes) {
    this.routes = routes;
  }

  routeTo(path: string) {
    const model = container.get<Model>(types.Model);

    if (!this.routes[path]) {
      throw new Error("Path not found. Please register route first.");
    }

    window.history.pushState(null, path, `${window.location.origin}${path}`);

    model.setState(this.routes[path]());
  }
}
