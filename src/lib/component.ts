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
  shouldUpdate:()=>boolean;
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
    console.log(this.constructor.name, "has id=", this.domId);
  }

  onMount() {}

  onUnmount() {}

  onUpdate() {}

  shouldUpdate(){
    return true;
  }

  render() {
    return document.createElement("template");
  }
}
