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
                ${images && getImageList()}
            <nav class="content__navigation">
            </nav>
         </figure>
         <section class="image_slider__info">
             <div class="info__slide_count">
                ${images &&
                  currentSlide !== undefined &&
                  currentSlide / 2 + 1 + " / " + images.length / 2}
            </div>
            <p class="info__description">test description</p>
                <button>
                    reset
                </button>
         </section>
        <nav class="image_slider__navigation">
            <ul class="navigation__list">
                ${images && getThumbnails()}
            </ul>
        </nav>
    </div>
`;
