import { injectable, inject } from "inversify";
import { types } from "./IOC/types";
import { IModel } from "./model";

export interface IComponent {
  props: string[];
  model: IModel;
  domId: number;
  onMount: () => void;
  onUnmount: () => void;
  onUpdate: () => void;
  render: () => HTMLTemplateElement;
}

@injectable()
export class Component implements IComponent {
  model: IModel;
  domId: number;
  props: string[] = [];
  // template ?

  constructor(@inject(types.Model) model: IModel) {
    this.model = model;
    this.domId = this.model.getDomId();
  }

  onMount() {}

  onUnmount() {}

  onUpdate() {}

  render() {
    return document.createElement("template");
  }
}
