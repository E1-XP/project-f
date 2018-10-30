import { Component } from "./../../lib/component";
import { html } from "./../../lib";

export interface Props {}

export class PageBackgrounds extends Component {
  props = ["currentSlide"];

  active: HTMLElement | null = null;
  prevActiveStyle: string = "";
  isOdd = false;

  getBackgrounds = () => {
    const { extractedColors, currentSlide } = this.model.getState();

    if (currentSlide === undefined || !extractedColors) {
      throw new Error("page backgrounds crashed.");
    }

    const val = (() => {
      const darkMuted = extractedColors[currentSlide].DarkMuted;
      if (darkMuted) return darkMuted._rgb.join(",");

      return extractedColors[currentSlide].DarkVibrant._rgb.join(",");
    })();

    const val2 = (() => {
      const muted = extractedColors[currentSlide].Muted;
      if (muted) return muted._rgb.join(",");

      return extractedColors[currentSlide].Vibrant._rgb.join(",");
    })();

    this.prevActiveStyle = this.active
      ? <string>this.active.style.background
      : "";

    const template = (val: string, val2: string) =>
      `linear-gradient(to top,#232526, rgb(${val}),rgb(${val2}))`;

    return { active: template(val, val2), back: this.prevActiveStyle };
  };

  render() {
    this.isOdd = !this.isOdd; // force class replacement to enable transition
    this.active = document.querySelector(".page_background__item.active div");

    const { active, back } = this.getBackgrounds();

    return html`
        <ul class="page_background">
            <li class="page_background__item ${this.isOdd ? "active" : "back"}">
                <div style="background:${this.isOdd ? active : back};"></div>
            </li>
            <li class="page_background__item ${this.isOdd ? "back" : "active"}">
                <div style="background:${this.isOdd ? back : active};" ></div>
            </li>
        </ul>
    `;
  }
}
