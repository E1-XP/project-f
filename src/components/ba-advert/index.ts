import { Component } from "./../../lib/component";
import { html } from "./../../lib";

import { button } from "./../shared";

export interface Props {}

export class BeforeAfterAd extends Component {
  onMount = () => {
    const btn = document.getElementById("js-ba-ad");
    btn && btn.addEventListener("click", this.handleClick);
  };

  onUnmount = () => {
    const btn = document.getElementById("js-ba-ad");
    btn && btn.removeEventListener("click", this.handleClick);
  };

  handleClick = () => {
    this.router.routeTo("/ba");
  };

  render() {
    return html`
      <aside class="ba_advert">
          <h2 class="ba_advert__heading">
              Let's go backwards and see what it takes to produce image like this.
          </h2>
         ${button("Enter section!", "big", { id: "js-ba-ad" })}
          <div class="ba_advert__background"></div>
      </aside>`;
  }
}
