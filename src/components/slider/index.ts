import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  images: any[] | undefined;
  currentSlide: number | undefined;
  getImageList: () => string[] | string;
  getThumbnails: () => string[] | string;
}

export class Slider extends Component {
  props = ["images", "currentSlide"];
  slides: HTMLImageElement[] = [];
  sliderInterval: any = null;

  backBtn: HTMLElement | null = null;
  stopStartBtn: HTMLElement | null = null;
  getFullSizeBtn: HTMLElement | null = null;
  nextBtn: HTMLElement | null = null;

  onMount = () => {
    this.backBtn = document.getElementById("js-slider-back");
    this.stopStartBtn = document.getElementById("js-slider-stop");
    this.getFullSizeBtn = document.getElementById("js-slider-getimg");
    this.nextBtn = document.getElementById("js-slider-next");

    this.slides = Array.from(document.querySelectorAll(".image_slider img"));

    if (
      !this.backBtn ||
      !this.stopStartBtn ||
      !this.nextBtn
      // !this.getFullSizeBtn
    ) {
      throw new Error("DOM elements not found.");
    }

    this.backBtn.addEventListener("click", this.prevSlide);
    this.stopStartBtn.addEventListener("click", this.stopStartSlider);
    // this.getFullSizeBtn.addEventListener("click", this.getFullImage);
    this.nextBtn.addEventListener("click", this.nextSlide);

    document.addEventListener("keydown", this.enableKeySteering);
    this.addThumbnailListeners();
    // this.stopStartSlider();
  };

  onUpdate = () => {
    this.onMount();
  };

  onUnmount = () => {
    if (
      !this.backBtn ||
      !this.stopStartBtn ||
      !this.nextBtn
      // !this.getFullSizeBtn
    ) {
      throw new Error("DOM elements not found.");
    }

    this.backBtn.removeEventListener("click", this.prevSlide);
    this.stopStartBtn.removeEventListener("click", this.stopStartSlider);
    // this.getFullSizeBtn.removeEventListener("click", this.getFullImage);
    this.nextBtn.removeEventListener("click", this.nextSlide);

    document.removeEventListener("keydown", this.enableKeySteering);
    this.removeThumbnailListeners();
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

  getFullImage = () => {
    alert("ok");
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
            <img src="${URL}/${itm.dir}" alt="image">
         </li>`
    );
  };

  addThumbnailListeners = () => {
    const domRefs = document.querySelectorAll(
      ".image_slider__navigation .item__cover"
    );

    domRefs &&
      Array.from(domRefs).forEach(ref => {
        ref.addEventListener("click", this.handleThumbnailClick);
      });
  };

  removeThumbnailListeners = () => {
    const domRefs = document.querySelectorAll(
      ".image_slider__navigation .item__cover"
    );

    domRefs &&
      Array.from(domRefs).forEach(ref => {
        ref.removeEventListener("click", this.handleThumbnailClick);
      });
  };

  handleThumbnailClick = (e: any) => {
    const currentSlide = Number(e.target.closest("li").dataset.idx);

    this.model.setState({ currentSlide });
  };

  getThumbnails = () => {
    const { images, currentSlide } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    const isImgActive = (idx: number) => currentSlide === idx;

    if (!images) return "";

    return images.map(
      (itm, idx) => `<li class="navigation__item${
        isImgActive(idx) ? " active" : ""
      }" data-idx=${idx}>
      <img src="${URL}/${itm.thumbnail}" alt="gallery thumbnail">
      <span class="item__cover"></span>
    </li>`
    );
  };

  render(): HTMLTemplateElement {
    const { images, currentSlide } = this.model.getState();

    return template({
      images,
      currentSlide,
      getImageList: this.getImageList,
      getThumbnails: this.getThumbnails
    });
  }
}
