import { injectable } from "inversify";

import { container } from "./IOC";
import { types } from "./IOC/types";
import { Model } from "./model";

export interface IRoutes {
  [key: string]: () => Partial<{}>;
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

    const handleGHPages = path.replace("/GTxM-front", "");

    if (!this.routes[handleGHPages]) {
      throw new Error(
        `Path ${handleGHPages} not found. Please register route first.`
      );
    }

    window.history.pushState(
      null,
      handleGHPages,
      `${window.location.origin}/GTxM-front${handleGHPages}`
    );

    model.setState(this.routes[handleGHPages]());
  }
}
