import { html, run } from "./../../lib";

import { Props } from "./index";

import { PageBackgrounds } from "./../backgrounds";
import { Header } from "./../header";
import { Slider } from "./../slider";
import { BeforeAfterAd } from "./../ba-advert";
import { Footer } from "./../footer";

export default ({ parentRef }: Props) => html`
    <div>
        ${run(PageBackgrounds, parentRef)}
        <div class="l-page_container">
            ${run(Header, parentRef)}
            <main>
                ${run(Slider, parentRef)}
                ${run(BeforeAfterAd, parentRef)}
                ${run(Footer, parentRef)}
            </main>
        </div>
    </div>
`;
