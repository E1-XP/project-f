import { Component } from "./../../lib/component";
import { html } from "./../../lib";

export interface Props {}

export class BeforeAfterAd extends Component {
  render() {
    return html`
      <aside class="ba_advert">
          <h2 class="ba_advert__heading">
              Let's go backwards and see what it takes to produce image like this.
          </h2>
          <button class="ba_advert__button">Enter section!</button>
          <div class="ba_advert__background"></div>
      </aside>`;
  }
}
