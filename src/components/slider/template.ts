import { html } from "./../../lib";

import { Props } from "./index";

export default ({
  images,
  getImageList,
  getThumbnails,
  currentSlide
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
                <div class="navigation__button--stop" id="js-slider-stop">
                    <span class="material-icons icon">pause</span>
                </div>
                <!-- <div class="navigation__button--stop" id="js-slider__getimg">
                    <span class="material-icons icon">pause</span>
                </div> -->
                  <!-- <div class="navigation__button--stop" id="js-slider__fullscreen">
                    <span class="material-icons icon">pause</span>
                </div> -->
                <div class="navigation__button--right" id="js-slider-next">
                    <span class="material-icons icon">arrow_forward_ios</span>
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
                <div class="likes__count">0</div>
                <button class="likes__button">
                    <span class="material-icons">add</span>
                </button>
             </div>
         </section>
        <nav class="image_slider__navigation">
            <ul class="navigation__list">
                ${images && getThumbnails()}
            </ul>
        </nav>
    </div>
`;
