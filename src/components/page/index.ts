import { Component, IComponent } from "./../../lib/component";

import template from "./template";

export interface Props {
  parentRef: IComponent;
  isMenuOpen: boolean | undefined;
}

export class Page extends Component {
  props = ["isMenuOpen"];

  pageBtn: HTMLElement | null = null;

  onMount = () => {
    this.attachHandlers();
  };

  onUpdate = () => {
    this.attachHandlers();
  };

  onUnmount = () => {
    this.pageBtn &&
      this.pageBtn.removeEventListener("click", this.handlePageClick);
  };

  attachHandlers = () => {
    this.pageBtn = document.getElementById("js-page-btn");

    this.pageBtn &&
      this.pageBtn.addEventListener("click", this.handlePageClick);
  };

  handlePageClick = () => {
    this.model.setState({ isMenuOpen: false });
  };

  render(): HTMLTemplateElement {
    const { isMenuOpen } = this.model.getState();

    return template({ isMenuOpen, parentRef: this });
  }
}
