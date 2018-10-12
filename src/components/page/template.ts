import { html, run } from "./../../lib";

import { Props } from "./index";

import { PageBackgrounds } from "./../backgrounds";
import { Navigation } from "./../navigation";
import { Header } from "./../header";
import { Slider } from "./../slider";
import { CompareSlider } from "./../ba-slider";
import { BeforeAfterAd } from "./../ba-advert";
import { Footer } from "./../footer";

export default ({ parentRef, isMenuOpen, currentPart }: Props) => html`
    <div ${isMenuOpen && 'class="js-is-open"'}>
        ${run(PageBackgrounds, parentRef)}
        <div class="l-page_container${isMenuOpen && " js-is-open"}">
            ${run(Header, parentRef)}
            <main>
                ${
                  currentPart && currentPart !== 5
                    ? run(Slider, parentRef)
                    : run(CompareSlider, parentRef)
                }
                ${currentPart &&
                  currentPart !== 5 &&
                  run(BeforeAfterAd, parentRef)}
            </main>
            ${run(Footer, parentRef)}
            ${isMenuOpen && '<div class="page__button" id="js-page-btn"></div>'}
        </div>
        ${isMenuOpen && run(Navigation, parentRef)}
    </div>
`;
