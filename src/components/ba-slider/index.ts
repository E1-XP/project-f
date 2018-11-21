import { Component } from "./../../lib/component";

import template from "./template";

export interface Props {
  images: any[] | undefined;
  currentSlide: number | undefined;
  getImageList: () => string[] | string;
  getThumbnails: () => string[] | string;
}

export class CompareSlider extends Component {
  props = ["images", "currentSlide"];

  resizerBtn: HTMLElement | null = null;
  afterDiv: HTMLElement | null = null;
  beforeDiv: HTMLElement | null = null;

  onMount = () => {
    this.resizerBtn = document.getElementById("js-ba-resize");
    this.beforeDiv = document.getElementById("js-ba-before");
    this.afterDiv = document.getElementById("js-ba-after");

    this.resizerBtn &&
      ["mousedown", "touchstart"].forEach(
        evt =>
          this.resizerBtn &&
          this.resizerBtn.addEventListener(evt, this.onMouseDown)
      );

    this.addThumbnailListeners();
  };

  onUnmount = () => {
    this.removeThumbnailListeners();

    this.resizerBtn &&
      ["mousedown", "touchstart"].forEach(
        evt =>
          this.resizerBtn &&
          this.resizerBtn.removeEventListener(evt, this.onMouseDown)
      );
  };

  onMouseDown = (e: any) => {
    const throttle = (fn: any, delay: number) => {
      let isThrottled = false;

      return (...args: any[]) => {
        if (!isThrottled) {
          fn(...args);
          isThrottled = true;
          setTimeout(() => (isThrottled = false), delay);
        }
      };
    };

    this.onMouseMove = throttle(this.onMouseMove, 10);

    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("touchmove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("touchend", this.onMouseUp);
  };

  getWidth = (e: any) => {
    if (!this.beforeDiv) throw new Error("DOM sync error in ba-slider");

    const beforeDivDim = this.beforeDiv.getBoundingClientRect();
    const newPos = (() => {
      if (e.type === "touchmove") {
        return e.touches[0].pageX - beforeDivDim.left;
      }
      return e.pageX - beforeDivDim.left;
    })();

    if (newPos > beforeDivDim.width) return 100;
    if (newPos < 0) return 0;
    return (newPos / beforeDivDim.width) * 100;
  };

  onMouseMove = (e: any) => {
    if (this.afterDiv) this.afterDiv.style.width = `${this.getWidth(e)}%`;
  };

  onMouseUp = () => {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("touchmove", this.onMouseMove);
  };

  getClassNames = (idx: number) => {
    const { currentSlide } = this.model.getState();

    if (currentSlide === undefined) {
      throw new Error("store probably crashed");
    }

    const isCurrent = idx === currentSlide;
    const backSlideIdx = !currentSlide ? length - 1 : currentSlide - 1;

    return `content__item${isCurrent ? " active" : ""}${
      idx === backSlideIdx ? " back" : ""
    }`;
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
    const currentSlide = Number(e.target.closest("li").dataset.idx) - 1;

    this.model.setState({ currentSlide });
  };

  getImageList = () => {
    const { images, currentSlide } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    if (currentSlide === undefined) throw new Error("cant find model state");

    if (!images) return "";

    return `<div class="ba_content" id="js-ba-before"
    style="background:url('${URL}/${images[currentSlide].dir}')">
        <div class="ba_content__after_container" id="js-ba-after"
        style="background:url('${URL}/${images[currentSlide + 1].dir}')">
            <span class="after_container__resize" id="js-ba-resize">
            </span>
        </div>
    </div>`;
  };

  getThumbnails = () => {
    const { images, currentSlide } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    if (currentSlide === undefined || !images) {
      throw new Error("state sync error");
    }

    const isImgActive = (idx: number) => currentSlide + 1 === idx;

    if (!images) return "";

    return images.map(
      (itm, idx) =>
        idx % 2
          ? `<li class="navigation__item${
              isImgActive(idx) ? " active" : ""
            }" data-idx=${idx}>
      <img src="${URL}/${itm.thumbnail}" alt="gallery thumbnail">
      <span class="item__cover"></span>
    </li>`
          : ""
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
