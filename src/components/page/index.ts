import { Component, IComponent } from "./../../lib/component";

import * as effects  from './../../effects';

import template from "./template";

export interface Props {
  parentRef: IComponent;
  isMenuOpen: boolean | undefined;
  currentPart: number | undefined;
}

export class Page extends Component {
  props = ["isMenuOpen"];

  pageBtn: HTMLElement | null = null;

  onMount =()=>{
    effects.getMenuImages();
  }

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

    const cont: any = document.querySelector(".l-page_container")!;
    setTimeout(() => (cont.style.maxHeight = "none"), 900);
  };

  render(): HTMLTemplateElement {
    const { isMenuOpen, currentPart } = this.model.getState();

    return template({ isMenuOpen, currentPart, parentRef: this });
  }
}
