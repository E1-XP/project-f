import { Component } from "./../../lib/component";

import * as effects from "./../../effects";
import template from "./template";

export interface Props {
  images: any[] | undefined;
  currentSlide: number | undefined;
  isSliderRunning: boolean | undefined;
  isLightboxOpen: boolean | undefined;
  getImageList: () => string[] | string;
  getThumbnails: () => string[] | string;
  getLikes: (idx: number) => string;
  checkIfLiked: (idx: number) => boolean;
}

export class Slider extends Component {
  props = ["images", "currentSlide", "isSliderRunning", "isLightboxOpen"];

  backBtn: HTMLElement | null = null;
  stopStartBtn: HTMLElement | null = null;
  getFullSizeBtn: HTMLElement | null = null;
  toggleLightboxBtn: HTMLElement | null = null;
  lightboxElem: HTMLElement | null = null;
  nextBtn: HTMLElement | null = null;
  likeBtn: HTMLElement | null = null;
  progressBar: HTMLElement | null = null;

  onMount = () => {
    this.backBtn = document.getElementById("js-slider-back");
    this.stopStartBtn = document.getElementById("js-slider-stop");
    this.getFullSizeBtn = document.getElementById("js-slider-getimg");
    this.nextBtn = document.getElementById("js-slider-next");
    this.lightboxElem = document.getElementById("js-lightbox")!;
    this.toggleLightboxBtn = document.getElementById("js-slider-fullscreen");
    this.likeBtn = document.getElementById("js-likes-btn");
    this.progressBar = document.querySelector(".navigation__progress");

    this.appendListeners();
    this.stopStartSlider();
  };

  onUnmount = () => {
    this.detachListeners();
    this.stopSlider();
  };

  onUpdate = () => {
    const { isLightboxOpen, isSliderRunning } = this.model.getState();

    if (isLightboxOpen) {
      this.lightboxElem &&
        this.lightboxElem.addEventListener("click", this.toggleLightbox);
    } else {
      this.lightboxElem &&
        this.lightboxElem.removeEventListener("click", this.toggleLightbox);
    }

    if (isSliderRunning && this.progressBar) {
      setTimeout(() => this.progressBar!.classList.add("is-open"), 400);
    }
  };

  appendListeners = () => {
    if (
      !this.backBtn ||
      !this.stopStartBtn ||
      !this.nextBtn ||
      !this.likeBtn ||
      !this.toggleLightboxBtn ||
      !this.getFullSizeBtn ||
      !this.getFullSizeBtn
    ) {
      throw new Error("DOM elements not found.");
    }

    this.backBtn.addEventListener("click", this.prevSlide);
    this.stopStartBtn.addEventListener("click", this.stopStartSlider);
    this.toggleLightboxBtn.addEventListener("click", this.toggleLightbox);
    this.getFullSizeBtn.addEventListener("click", this.getFullImage);
    this.nextBtn.addEventListener("click", this.nextSlide);
    this.likeBtn.addEventListener("click", this.handleLikeClick);

    document.addEventListener("keydown", this.enableKeySteering);
    this.addThumbnailListeners();
  };

  detachListeners = () => {
    const { isLightboxOpen } = this.model.getState();

    if (
      !this.backBtn ||
      !this.stopStartBtn ||
      !this.nextBtn ||
      !this.likeBtn ||
      !this.toggleLightboxBtn ||
      !this.getFullSizeBtn ||
      !this.getFullSizeBtn
    ) {
      throw new Error("DOM elements not found.");
    }

    this.backBtn.removeEventListener("click", this.prevSlide);
    this.stopStartBtn.removeEventListener("click", this.stopStartSlider);
    this.toggleLightboxBtn.removeEventListener("click", this.toggleLightbox);
    this.getFullSizeBtn.removeEventListener("click", this.getFullImage);
    this.nextBtn.removeEventListener("click", this.nextSlide);
    this.likeBtn.removeEventListener("click", this.handleLikeClick);
    isLightboxOpen &&
      this.lightboxElem &&
      this.lightboxElem.removeEventListener("click", this.toggleLightbox);

    document.removeEventListener("keydown", this.enableKeySteering);

    this.removeThumbnailListeners();
  };

  nextSlide = (e: any) => {
    const { currentSlide, images, isSliderRunning } = this.model.getState();

    if (currentSlide === undefined || !images) {
      throw new Error("store probably crashed");
    }
    const onLastSlide = currentSlide >= images.length - 1;

    this.model.setState({
      currentSlide: onLastSlide ? 0 : currentSlide + 1
    });

    if (isSliderRunning && this.progressBar) {
      if (this.progressBar.classList.contains("is-open")) {
        this.progressBar.classList.remove("is-open");
      }
    }

    if (e.type !== "click" || (e.screenX && e.screenY)) {
      this.stopSlider();
    }
  };

  prevSlide = () => {
    const { currentSlide, images } = this.model.getState();

    if (currentSlide === undefined || !images) {
      throw new Error("store probably crashed");
    }
    const inFirstSlide = currentSlide === 0;

    this.model.setState({
      isSliderRunning: false,
      currentSlide: inFirstSlide ? images.length - 1 : currentSlide + -1
    });

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    }
    this.progressBar!.classList.remove("is-open");
  };

  stopStartSlider = () => {
    const { isSliderRunning, slideInterval } = this.model.getState();
    const handleClick = () => this.nextBtn && this.nextBtn.click();

    this.model.setState({ isSliderRunning: !isSliderRunning });

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    } else {
      (<any>window).sliderInterval = setInterval(handleClick, slideInterval);
      setTimeout(() => this.progressBar!.classList.add("is-open"), 400);
    }
  };

  stopSlider = () => {
    this.model.setState({ isSliderRunning: false });

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    }
    this.progressBar!.classList.remove("is-open");
  };

  enableKeySteering = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 39:
        this.nextSlide(e);
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

  getFullImage = (e: any) => {
    const img: any = document.querySelector(
      ".image_slider__content .content__item.active img"
    );
    img && window.open(img.src, "_blank");
  };

  toggleLightbox = () => {
    const { isLightboxOpen } = this.model.getState();
    this.model.setState({ isLightboxOpen: !isLightboxOpen });
  };

  getClassNames = (length: number, idx: number) => {
    const { currentSlide } = this.model.getState();
    const currElem: any = document.querySelector(
      ".image_slider .content__list .active"
    );

    if (currentSlide === undefined) {
      throw new Error("store probably crashed");
    }

    // its taken from DOM before update occurs
    const prevActiveIdx = currElem
      ? Number(currElem.dataset.idx)
      : currentSlide;

    const isCurrent = idx === currentSlide;
    const isDecremented =
      (prevActiveIdx === 0 && currentSlide === length - 1) ||
      currentSlide < prevActiveIdx;

    const getBackSlideIdx = (idx: number) => {
      const equals = (val: number) => val === idx;

      if (Math.abs(currentSlide - prevActiveIdx) > 1) {
        return equals(prevActiveIdx);
      }
      return equals(isDecremented ? currentSlide + 1 : currentSlide - 1);
    };

    return `content__item${isCurrent ? " active" : ""}${
      getBackSlideIdx(idx) ? " back" : ""
    }`;
  };

  getImageList = () => {
    const { images } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    if (!images) return "";

    return images.map(
      (itm, i, arr) =>
        `<li class="${this.getClassNames(arr.length, i)}" data-idx="${i}">
            <img src="${URL}/${itm.dir}" alt="high performance vehicle"> 
         </li>` // TODO alt attr can be taken from image description
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

    this.model.setState({ currentSlide, isSliderRunning: false });

    if ((<any>window).sliderInterval) {
      clearInterval((<any>window).sliderInterval);
      (<any>window).sliderInterval = 0;
    }
    this.progressBar!.classList.remove("is-open");
  };

  handleLikeClick = () => {
    const { currentPart, currentSlide } = this.model.getState();

    if (currentPart === undefined || currentSlide === undefined) {
      throw new Error(`can't connect state`);
    }

    if (!this.checkIfLiked(currentSlide)) {
      effects.addLike(currentPart, currentSlide);
    }
  };

  checkIfLiked = (slideNum: number) => {
    const { currentPart } = this.model.getState();
    const data = localStorage.getItem("data");

    if (currentPart === undefined || !data) {
      throw new Error("preloader probably not working");
    }

    return JSON.parse(data)[currentPart][slideNum];
  };

  getLikes = (idx: number) => {
    const { images } = this.model.getState();
    if (!images) throw new Error("check slider for state error");

    return Number(images[idx].likes).toString();
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
      <span class="item__cover"></span>
      <img src="${URL}/${itm.thumbnail}" alt="gallery thumbnail">
    </li>`
    );
  };

  render(): HTMLTemplateElement {
    const {
      images,
      currentSlide,
      isSliderRunning,
      isLightboxOpen
    } = this.model.getState();

    return template({
      images,
      currentSlide,
      isSliderRunning,
      isLightboxOpen,
      getImageList: this.getImageList,
      getThumbnails: this.getThumbnails,
      getLikes: this.getLikes,
      checkIfLiked: this.checkIfLiked
    });
  }
}
