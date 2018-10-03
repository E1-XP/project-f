import { html } from "./../../lib";

import { Props } from "./index";

export default ({ images, getImageList }: Props) => html`
    <div class="image_slider">
        <figure class="image_slider__content">
            <ul class="content__list">
            ${images && getImageList()}
            </ul> 
            <nav class="content__navigation">
                <div class="navigation__button--left" id="js-slider__back">
                    <span class="material-icons icon">arrow_back</span>
                </div>
                <div class="navigation__button--stop" id="js-slider__stop">
                    <span class="material-icons icon">pause</span>
                </div>
                <div class="navigation__button--right" id="js-slider__next">
                    <span class="material-icons icon">arrow_forward</span>
                </div>
            </nav>
         </figure>
        <nav class="image_slider__navigation">
            <ul class="navigation__list">
                ${images && images.length}
            </ul>
        </nav>
    </div>
`;
