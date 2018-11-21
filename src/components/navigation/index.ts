import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  getMenuItems: () => string[];
}

export class Navigation extends Component {
  URL = "https://boiling-citadel-14104.herokuapp.com";

  backgrounds = [
    `${this.URL}/static/img/1/kr048.jpg`,

    `${this.URL}/static/img/2/bt52Mo.jpg`,

    `${this.URL}/static/img/3/917v2c222.jpg`,

    `${this.URL}/static/img/4/S1PP2.jpg`
  ];

  onMount = () => {
    this.backgrounds.forEach((itm, i) => {
      const domRef: any = document.getElementById(`js-menu-item-${i + 1}`);

      domRef &&
        domRef.closest("li").addEventListener("click", this.handleMenuClick);
    });
  };

  onUnmount = () => {
    this.backgrounds.forEach((itm, i) => {
      const domRef: any = document.getElementById(`js-menu-item-${i + 1}`);

      domRef &&
        domRef.closest("li").removeEventListener("click", this.handleMenuClick);
    });
  };

  handleMenuClick = (e: any) => {
    const { currentPart } = this.model.getState();

    const parts = ["one", "two", "three", "four"];
    const clickedPart = Number(e.target.closest("li").dataset.idx);
    const differentPart = clickedPart + 1 !== currentPart;

    const deferRouteChange = () =>
      this.router.routeTo(`/${parts[clickedPart]}`);

    this.model.setState({ isMenuOpen: false });
    if (differentPart) setTimeout(deferRouteChange, 500);
  };

  getMenuItems = () => {
    const { currentPart } = this.model.getState();

    return this.backgrounds.map((itm, i) => {
      const shouldHide = currentPart === i + 1;

      return `<li class="list__item ${
        shouldHide ? "active" : ""
      }" data-idx=${i}>
            <a id="js-menu-item-${i + 1}">
              <span style="background:url(${itm})">${i + 1}</span>
            </a>
         </li>`;
    });
  };

  render() {
    return template({ getMenuItems: this.getMenuItems });
  }
}
