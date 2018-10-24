import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  getPartName: () => string;
  currentPart: number | undefined;
}

export class Header extends Component {
  props = ["currentPart"];

  menuBtn: HTMLElement | null = null;
  baSectionBtn: HTMLElement | null = null;
  headerAnchor: HTMLElement | null = null;

  onMount = () => {
    this.menuBtn = document.getElementById("js-change-section");
    this.baSectionBtn = document.getElementById("js-before-after");
    this.headerAnchor = document.getElementById("js-header-logo");

    this.menuBtn &&
      this.menuBtn.addEventListener("click", this.handleMenuClick);
    this.baSectionBtn &&
      this.baSectionBtn.addEventListener("click", this.handleBaSectionClick);
    this.headerAnchor &&
      this.headerAnchor.addEventListener("click", this.handleHeaderLogoClick);
  };

  onUnmount = () => {
    this.menuBtn &&
      this.menuBtn.removeEventListener("click", this.handleMenuClick);
    this.baSectionBtn &&
      this.baSectionBtn.removeEventListener("click", this.handleBaSectionClick);
    this.headerAnchor &&
      this.headerAnchor.removeEventListener(
        "click",
        this.handleHeaderLogoClick
      );
  };

  handleMenuClick = (e: any) => {
    const { isMenuOpen } = this.model.getState();
    this.model.setState({ isMenuOpen: !isMenuOpen });

    const cont: any = document.querySelector(".l-page_container");
    if (cont) cont.style.maxHeight = "100vh";
  };

  handleHeaderLogoClick = () => {
    this.router.routeTo("/");
  };

  handleBaSectionClick = () => {
    const { currentPart } = this.model.getState();

    this.router.routeTo(currentPart === 5 ? "/" : "/ba");
  };

  getPartName = () => {
    const { currentPart } = this.model.getState();
    const partNames = ["One", "Two", "Three", "Four"];

    return `Part ${currentPart && partNames[currentPart - 1]}`;
  };

  render() {
    const { currentPart } = this.model.getState();

    return template({ currentPart, getPartName: this.getPartName });
  }
}
