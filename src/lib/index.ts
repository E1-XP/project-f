import { container } from "./IOC";
import { types } from "./IOC/types";

import { Helpers } from "./helpers";
import { IComponent } from "./component";
import { Model } from "./model";
import { Router, IRoutes } from "./router";

import { State } from "./../store";
import { AppCore } from "./core";

export const initApp = (
  app: IComponent,
  root: HTMLElement,
  routes: IRoutes,
  initialState?: Partial<State>
) => {
  const model = container.get<Model>(types.Model);
  const router = container.get<Router>(types.Router);
  const helpers = container.get<Helpers>(types.Helpers);

  model.createStore(initialState || undefined);
  router.registerRoutes(routes);

  const currRoute = window.location.pathname;
  const handleRootRoute = currRoute === "/" ? "/one" : currRoute;

  router.routeTo(handleRootRoute);
  helpers.renderToDOM(app, root);
};

export const { html, renderToDOM } = container.get<Helpers>(types.Helpers);
export const { run, rerender } = container.get<AppCore>(types.AppCore);
