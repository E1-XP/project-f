import { injectable } from "tsyringe";

import { container } from "./IOC";
import { types } from "./IOC/types";

import { AppCore } from "./core";
import { IComponent } from "./component";
import { Model, EmptyState } from "./model";
import { Router, IRoutes } from "./router";
import { model } from "./index";

@injectable()
export class Initializer {
  rootComponent: IComponent | null = null;

  initApp = (
    app: IComponent,
    routes: IRoutes,
    initialState?: Partial<EmptyState>
  ) => {
    const model = container.resolve<Model>(types.Model);
    const router = container.resolve<Router>(types.Router);

    this.rootComponent = app;

    model.createStore(initialState || undefined);
    router.registerRoutes(routes);

    if (routes && Object.keys(routes).length) {
      const currRoute = window.location.pathname;
      const handleRootRoute =
        currRoute === "/" ? Object.keys(routes)[0] || "/" : currRoute;

      router.routeTo(handleRootRoute);
    }

    return {
      renderToDOM: this.renderToDOM.bind(this)
      // renderToString: this.renderToString.bind(this),
      // subscribe: model.subscribeExternal.bind(model)
    };
  };

  private render() {
    const core = container.resolve<AppCore>(types.AppCore);

    const template = document.createElement("template");
    template.innerHTML = core.run(this.rootComponent!, "a");

    return template;
  }

  renderToDOM(root: HTMLElement) {
    const template = this.render();

    root.innerHTML = "";
    root.appendChild(template.content);
  }

  // renderToString(cb: (s: string) => any) {
  //   model.subscribeExternal(state => {
  //     const template = this.render();
  //     const markup = template.innerHTML;

  //     cb(markup);
  //   });
  // }
}
