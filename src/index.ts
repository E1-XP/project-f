import { container } from "./IOC";
import { types } from "./IOC/types";

import { Helpers } from "./helpers";
import { AppCore } from "./core";

export { container } from "./IOC";
export { types } from "./IOC/types";

export { Model } from "./model";
export { Component, IComponent } from "./component";

export const { html, renderToDOM } = container.get<Helpers>(types.Helpers);
export const { run, rerender } = container.get<AppCore>(types.AppCore);

export { initApp } from "./initializer";
