import { injectable, inject } from "tsyringe";
import { types } from "./IOC/types";

import { Model, EmptyState } from "./model";

export interface IRoutes {
  [key: string]: () => Partial<EmptyState>;
}

@injectable()
export class Router {
  routes: IRoutes = {};

  constructor(@inject(types.Model) private model: Model) {
    this.model = model;

    this.onHistoryPop();
  }

  onHistoryPop() {
    window.onpopstate = () =>
      this.model.setState(() => this.routes[window.location.pathname]());
  }

  registerRoutes(routes: IRoutes) {
    this.routes = routes;
  }

  routeTo(pathName: string) {
    const path = pathName === "/" ? Object.keys(this.routes)[0] : pathName;

    if (!this.routes[path]) {
      throw new Error(`Path ${path} not found. Please register route first.`);
    }

    window.history.pushState(null, "", `${window.location.origin}${path}`);

    this.model.setState(() => this.routes[path]());
  }
}
