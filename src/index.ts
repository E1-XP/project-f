import { container } from "./IOC";
import { types } from "./IOC/types";

import { Helpers } from "./helpers";
import { AppCore } from "./core";
import { Model } from "./model";
import { Initializer } from "./initializer";

export { container } from "./IOC";
export { types } from "./IOC/types";

export { Model } from "./model";
export { Component, IComponent } from "./component";

export const model = container.resolve<Model>(types.Model);
export const { html } = container.resolve<Helpers>(types.Helpers);
export const { run, rerender } = container.resolve<AppCore>(types.AppCore);

export const { initApp } = container.resolve<Initializer>(types.Initializer);
