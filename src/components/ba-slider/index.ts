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

  onMount = () => {
    this.addThumbnailListeners();
  };

  onUpdate = () => {
    this.onMount();
  };

  onUnmount = () => {
    this.removeThumbnailListeners();
  };

  getClassNames = (idx: number) => {
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
    const { images, currentSlide } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    if (currentSlide === undefined) throw new Error("cant find model state");

    if (!images) return "";

    return `<div class="ba_content" style="background:url('${URL}/${
      images[currentSlide].dir
    }')">
        <div class="ba_content__after_container" style="background:url('${URL}/${
      images[currentSlide + 1].dir
    }')">
            <span class="after_container__resize" id="js-ba-resize">
            </span>
        </div>
    </div>`;
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

  getThumbnails = () => {
    const { images, currentSlide } = this.model.getState();
    const URL = `https://boiling-citadel-14104.herokuapp.com`;

    const isImgActive = (idx: number) => currentSlide === idx;

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
