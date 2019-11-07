import { injectable } from "inversify";

import { container } from "./IOC";
import { types } from "./IOC/types";
import { Model, EmptyState } from "./model";

export interface IRoutes {
  [key: string]: () => Partial<EmptyState>;
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
      throw new Error(`Path ${path} not found. Please register route first.`);
    }

    window.history.pushState(null, "", `${window.location.origin}${path}`);

    model.setState(this.routes[path]());
  }
}
