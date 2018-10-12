import { injectable, inject } from "inversify";
import { types } from "./IOC/types";
import { IModel } from "./model";
import { Router } from "./router";

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

  constructor(@inject(types.Model) model: IModel, router: Router) {
    this.model = model;
    this.router = router;
    this.domId = this.model.getDomId();
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
