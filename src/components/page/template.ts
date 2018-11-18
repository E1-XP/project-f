import { html, run } from "./../../lib";

import { Props } from "./index";

import { PageBackgrounds } from "./../backgrounds";
import { Navigation } from "./../navigation";
import { Header } from "./../header";
import { Slider } from "./../slider";
import { CompareSlider } from "./../ba-slider";
import { BeforeAfterAd } from "./../ba-advert";
import { SocialLinks } from "./../social-links";
import { Footer } from "./../footer";

export default ({ parentRef, isMenuOpen, currentPart }: Props) => html`
    <div ${isMenuOpen && 'class="is-open"'}>
        ${run(PageBackgrounds, "pb", parentRef)}
        <div class="l-page_container${isMenuOpen && " is-open"}">
            ${run(Header, "h", parentRef)}
            <main>
                ${
                  currentPart && currentPart !== 5
                    ? run(Slider, "s", parentRef)
                    : run(CompareSlider, "cs", parentRef)
                }
                ${currentPart &&
                  currentPart !== 5 &&
                  run(BeforeAfterAd, "baa", parentRef)}
            </main>
            ${run(SocialLinks, "sl", parentRef)}
            ${run(Footer, "f", parentRef)}
            ${isMenuOpen && '<div class="page__button" id="js-page-btn"></div>'}
        </div>
        ${isMenuOpen && run(Navigation, "n", parentRef)}
    </div>
`;
