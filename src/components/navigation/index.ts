import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  getMenuItems: () => string[];
}

export class Navigation extends Component {
  backgrounds = [
    "https://boiling-citadel-14104.herokuapp.com/static/img/1/kr048.jpg",

    "https://boiling-citadel-14104.herokuapp.com/static/img/2/bt52Mo.jpg",

    "https://boiling-citadel-14104.herokuapp.com/static/img/3/917v2c222.jpg",

    "https://boiling-citadel-14104.herokuapp.com/static/img/4/S1PP2.jpg"
  ];

  onMount = () => {
    this.backgrounds.map((itm, i) => {
      const element = document.getElementById(`js-menu-item-${i + 1}`);
      element && element.addEventListener("click", this.handleMenuClick);
    });
  };

  onUnmount = () => {
    this.backgrounds.map((itm, i) => {
      const element = document.getElementById(`js-menu-item-${i + 1}`);
      element && element.removeEventListener("click", this.handleMenuClick);
    });
  };

  handleMenuClick = (e: any) => {
    const selectedPart = Number(e.target.closest("li").dataset.idx) + 1;
    const setStateDefer = () =>
      this.model.setState({
        currentPart: selectedPart,
        currentSlide: 0,
        isLoading: true
      });

    this.model.setState({ isMenuOpen: false });
    setTimeout(setStateDefer, 500);
  };

  getMenuItems = () => {
    const { currentPart } = this.model.getState();

    return this.backgrounds.map((itm, i) => {
      const shouldHide = currentPart === i + 1;

      return `<li class="list__item " ${shouldHide &&
        'style="display:none" '} data-idx=${i}>
            <a href="#" id="js-menu-item-${i + 1}">
              <span style="background:url(${itm})">${i + 1}</span>
            </a>
         </li>`;
    });
  };

  render() {
    return template({ getMenuItems: this.getMenuItems });
  }
}
