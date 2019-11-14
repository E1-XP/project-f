import { IModel, EmptyState } from "./model";
import { Router } from "./router";
import { rerender } from "./index";

export interface IComponent {
  props: string[];
  model: IModel;
  domId: number;
  onMount(): void;
  onUnmount(): void;
  onUpdate<S = EmptyState>(prevState: S, state: S): void;
  shouldUpdate(): boolean;
  render(): HTMLTemplateElement;
}

export abstract class Component implements IComponent {
  model: IModel;
  router: Router;
  domId: number;
  abstract props: string[];
  // template ?

  constructor(model: IModel, router: Router) {
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
