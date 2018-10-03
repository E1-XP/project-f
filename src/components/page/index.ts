import { Component, IComponent } from "./../../lib/component";

import template from "./template";

export interface Props {
  parentRef: IComponent;
}

export class Page extends Component {
  render(): HTMLTemplateElement {
    return template({ parentRef: this });
  }
}
