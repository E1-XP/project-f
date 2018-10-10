import { html } from "./../../lib";

import { Props } from "./index";

export default ({ getMenuItems }: Props) => html`
    <div class="page_menu">
        <ul class="page_menu__list">
            ${getMenuItems()}
        </ul>
    </div>`;
