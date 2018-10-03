import { Component } from "./../../lib/component";
import { html } from "./../../lib";

export interface Props {}

export class PageBackgrounds extends Component {
  props = ["currentSlide"];

  render() {
    return html`
        <ul class="page_background">
            <li class="page_background__item active">
                <div></div>
            </li>
            <li class="page_background__item">
                <div></div>
            </li>
            <li class="page_background__item back">
                <div></div>
            </li>
        </ul>
    `;
  }
}
