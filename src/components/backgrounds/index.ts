import { Component } from "./../../lib/component";
import { html } from "./../../lib";

export interface Props {}

export class PageBackgrounds extends Component {
  props = ["currentSlide"];

  active: HTMLElement | null = null;
  prevActiveStyle: string = "";
  back: HTMLElement | null = null;

  onMount = () => {
    this.active = document.querySelector(".page_background__item.active div");
    this.back = document.querySelector(".page_background__item.back div");

    this.setBackground();
  };

  onUpdate = () => {
    this.active = document.querySelector(".page_background__item.active div");
    this.back = document.querySelector(".page_background__item.back div");

    this.setBackground();
  };

  setBackground = () => {
    const { extractedColors, currentSlide } = this.model.getState();

    if (
      currentSlide === undefined ||
      !this.active ||
      !this.back ||
      !extractedColors
    ) {
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

    this.back.style.background = this.prevActiveStyle;
    this.active.style.background = `linear-gradient(to top,#232526, rgb(${val}),rgb(${val2}))`;
    this.prevActiveStyle = this.active.style.background;
  };

  render() {
    return html`
        <ul class="page_background">
            <li class="page_background__item active">
                <div></div>
            </li>
            <li class="page_background__item back">
                <div></div>
            </li>
        </ul>
    `;
  }
}
