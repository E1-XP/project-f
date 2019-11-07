import { container } from "./IOC";
import { types } from "./IOC/types";

import { Helpers } from "./helpers";
import { IComponent } from "./component";
import { Model, EmptyState } from "./model";
import { Router, IRoutes } from "./router";

export const initApp = (
  app: IComponent,
  root: HTMLElement,
  routes: IRoutes,
  initialState?: Partial<EmptyState>
) => {
  const model = container.get<Model>(types.Model);
  const router = container.get<Router>(types.Router);
  const helpers = container.get<Helpers>(types.Helpers);

  model.createStore(initialState || undefined);
  router.registerRoutes(routes);

  const currRoute = window.location.pathname;
  const handleRootRoute = currRoute === "/" ? Object.keys(routes)[0] : currRoute;

  router.routeTo(handleRootRoute);
  helpers.renderToDOM(app, root);
};
