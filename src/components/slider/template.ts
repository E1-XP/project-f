import { html } from "./../../lib";

import { Props } from "./index";
import { button, icon } from "./../shared";

export default ({
  images,
  getImageList,
  getThumbnails,
  getLikes,
  currentSlide,
  checkIfLiked
}: Props) => html`
    <div class="image_slider">
        <figure class="image_slider__content">
            <ul class="content__list">
            ${images && getImageList()}
            </ul> 
            <nav class="content__navigation">
                <div class="navigation__button--left" id="js-slider-back">
                    <span class="material-icons icon">arrow_back_ios</span>
                </div>
                <div class="navigation__dock">
                    <div class="navigation__button--stop" id="js-slider-stop">
                        <span class="material-icons icon">pause</span>
                    </div>
                    <div class="navigation__button--stop" id="js-slider-getimg">
                        <span class="material-icons icon">pause</span>
                    </div>
                </div>
                <div class="navigation__button--right" id="js-slider-next">
                    <span class="material-icons icon">arrow_forward_ios</span>
                </div>
                <div class="navigation__button--fullscreen" id="js-slider-fullscreen">
                    <span class="material-icons icon">photo_size_select_large</span>
                </div>
            </nav>
         </figure>
         <section class="image_slider__info">
             <div class="info__slide_count">
                ${images &&
                  currentSlide !== undefined &&
                  currentSlide + 1 + " / " + images.length}
            </div>
             <p class="info__description">test description</p>
             <div class="info__likes">
                <div class="likes__count">${currentSlide !== undefined &&
                  getLikes(currentSlide)}</div>
                ${button(["like ", icon("add")], "medium", {
                  id: "js-likes-btn",
                  class:
                    currentSlide !== undefined && checkIfLiked(currentSlide)
                      ? "active"
                      : ""
                })}
             </div>
         </section>
        <nav class="image_slider__navigation">
            <ul class="navigation__list">
                ${images && getThumbnails()}
            </ul>
        </nav>
    </div>
`;
