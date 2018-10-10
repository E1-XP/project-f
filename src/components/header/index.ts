import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  getPartName: () => string;
}

export class Header extends Component {
  props = ["currentPart"];

  menuBtn: HTMLElement | null = null;

  onMount = () => {
    this.menuBtn = document.getElementById("js-change-section");
    this.menuBtn &&
      this.menuBtn.addEventListener("click", this.handleMenuClick);
  };

  onUnmount = () => {
    this.menuBtn &&
      this.menuBtn.removeEventListener("click", this.handleMenuClick);
  };

  handleMenuClick = (e: any) => {
    const { isMenuOpen } = this.model.getState();

    this.model.setState({ isMenuOpen: !isMenuOpen });
  };

  getPartName = () => {
    const { currentPart } = this.model.getState();
    const partNames = ["One", "Two", "Three", "Four"];

    return `Part ${currentPart && partNames[currentPart - 1]}`;
  };

  render() {
    return template({ getPartName: this.getPartName });
  }
}
