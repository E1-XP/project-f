import { Component } from "./../../lib/component";
import { html } from "./../../lib";

export interface Props {}

export class PageBackgrounds extends Component {
  props = ["currentSlide"];

  onMount = () => {
    const { extractedColors, currentSlide } = this.model.getState();

    const active = <HTMLElement>(
      document.querySelector(".page_background__item.active div")
    );

    console.log(active, extractedColors, "COLORS");

    if (currentSlide === undefined || !active || !extractedColors) {
      throw new Error("page backgrounds crashed.");
    }

    active.style.background = `linear-gradient(to top, #232526,rgb(${extractedColors[
      currentSlide
    ].DarkMuted._rgb.join(",")})`;
  };

  onUpdate = () => {
    this.onMount();
  };

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
