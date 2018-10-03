import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  images: any[] | undefined;
  getImageList: () => string[] | string;
}

export class Slider extends Component {
  props = ["images", "currentSlide"];
  slides: HTMLImageElement[] = [];
  sliderInterval: any = null;

  backBtn: HTMLElement | null = null;
  stopStartBtn: HTMLElement | null = null;
  nextBtn: HTMLElement | null = null;

  onMount = () => {
    this.backBtn = document.getElementById("js-slider__back");
    this.stopStartBtn = document.getElementById("js-slider__stop");
    this.nextBtn = document.getElementById("js-slider__next");

    this.slides = Array.from(document.querySelectorAll(".image_slider img"));

    if (!this.backBtn || !this.stopStartBtn || !this.nextBtn) {
      throw new Error("DOM elements not found.");
    }

    this.backBtn.addEventListener("click", this.prevSlide);
    this.stopStartBtn.addEventListener("click", this.stopStartSlider);
    this.nextBtn.addEventListener("click", this.nextSlide);

    document.addEventListener("keydown", this.enableKeySteering);
    // this.stopStartSlider();
  };

  onUpdate = () => {
    this.onMount();
  };

  onUnmount = () => {
    if (!this.backBtn || !this.stopStartBtn || !this.nextBtn) {
      throw new Error("DOM elements not found.");
    }

    this.backBtn.removeEventListener("click", this.prevSlide);
    this.stopStartBtn.removeEventListener("click", this.stopStartSlider);
    this.nextBtn.removeEventListener("click", this.nextSlide);

    document.removeEventListener("keydown", this.enableKeySteering);
  };

  nextSlide = () => {
    const { currentSlide, images } = this.model.getState();

    if (currentSlide === undefined || !images) {
      throw new Error("store probably crashed");
    }
    const inLastSlide = currentSlide > images.length - 1;

    this.model.setState({
      currentSlide: inLastSlide ? 0 : currentSlide + 1
    });
  };

  prevSlide = () => {
    const { currentSlide, images } = this.model.getState();

    if (currentSlide === undefined || !images) {
      throw new Error("store probably crashed");
    }
    const inFirstSlide = currentSlide === 0;

    this.model.setState({
      currentSlide: inFirstSlide ? images.length - 1 : currentSlide + -1
    });
  };

  stopStartSlider = () => {
    const handleClick = () => this.nextBtn && this.nextBtn.click();

    this.sliderInterval
      ? clearInterval(this.sliderInterval)
      : (this.sliderInterval = setInterval(handleClick, 3000));
  };

  enableKeySteering = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 39:
        this.nextSlide();
        return;
      case 37:
        this.prevSlide();
        return;
      case 32:
        this.stopStartSlider();
        return;
      default:
        return;
    }
  };

  getClassNames = (length: number, idx: number) => {
    const { currentSlide } = this.model.getState();

    if (currentSlide === undefined) {
      throw new Error("store probably crashed");
    }

    const isCurrent = idx === currentSlide;
    const backSlideIdx = currentSlide === 0 ? length - 1 : currentSlide - 1;

    return `content__item${isCurrent ? " active" : ""}${
      idx === backSlideIdx ? " back" : ""
    }`;
  };

  getImageList = () => {
    const { images } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    if (!images) return "";

    return images.map(
      (itm, i, arr) =>
        `<li class="${this.getClassNames(arr.length, i)}" data-idx="${i}">
            <img src="${URL}/${itm.dir}">
         </li>`
    );
  };

  render(): HTMLTemplateElement {
    const state = this.model.getState();
    const { images } = state;

    return template({
      images,
      getImageList: this.getImageList
    });
  }
}
