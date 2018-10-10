import { html } from "./../../lib";

import { Props } from "./index";

export default ({ getPartName }: Props) => html`
    <header class="page_header">
            <h1 class="page_header__logo">
                <a href="/">
                    <img src="https://www.imageupload.co.uk/images/2018/09/28/main.png" alt="GTxMotorsports">
                </a>             
            </h1>     
            <nav class="page_header__navigation">
                <ul class="navigation__list">
                        <li class="navigation__item">
                            <a href="/ba" id="js-before-after">Before / After Special</a>
                        </li>
                        <li class="navigation__item">
                            <span id="js-header-part">${getPartName()} /</span>
                            <a href="#" id="js-change-section">
                                <span class="material-icons">photo_library</span>
                            </a>
                        </li>
                    </ul>
            </nav>     
    </header>
  `;
