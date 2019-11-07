import { injectable, inject } from "inversify";
import { types } from "./IOC/types";

import { IModel } from "./model";
import { Router } from "./router";
import { rerender } from "./index";

export interface IComponent {
  props: string[];
  model: IModel;
  domId: number;
  onMount: () => void;
  onUnmount: () => void;
  onUpdate: () => void;
  shouldUpdate: () => boolean;
  render: () => HTMLTemplateElement;
}

@injectable()
export class Component implements IComponent {
  model: IModel;
  router: Router;
  domId: number;
  props: string[] = [];
  // template ?

  constructor(
    @inject(types.Model) model: IModel,
    @inject(types.Router) router: Router
  ) {
    this.model = model;
    this.router = router;
    this.domId = this.model.getDomId();
  }

  forceRerender() {
    rerender(this);
  }

  onMount() {}

  onUnmount() {}

  onUpdate() {}

  shouldUpdate() {
    return true;
  }

  render() {
    return document.createElement("template");
  }
}
