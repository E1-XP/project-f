import { html } from "./../../lib";

import { Props } from "./index";

const stdMenu = (getPartName: any) => html`
    <nav class="page_header__navigation">
        <ul class="navigation__list">
            <li class="navigation__item">
                    <a id="js-before-after">Before / After Special</a>
            </li>
            <li class="navigation__item">
                <span id="js-header-part">${getPartName()} /</span>
                <a id="js-change-section">
                        <span class="material-icons">photo_library</span>
                </a>
            </li>
        </ul>
    </nav>
`;

const baMenu = () => html`
    <nav class="page_header__navigation--ba">
        <ul class="navigation__list">
            <li class="navigation__item">
                <a id="js-before-after">
                    Return to gallery
                    <span class="material-icons h-mleft--05">arrow_forward</span>
                </a>
            </li>
        </ul>
    </nav>
`;
console.log(window.location.hostname);
export default ({ getPartName, currentPart }: Props) => html`
    <header class="page_header">
            <h1 class="page_header__logo">
                <a id="js-header-logo">
                    <img src="/GTxM-front/assets/img/main.png" alt="GTxMotorsports">
                </a>             
            </h1>     
             ${
               currentPart && currentPart !== 5
                 ? stdMenu(getPartName)
                 : baMenu()
             }
    </header>
  `;
