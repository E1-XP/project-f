import { Component } from "./../../lib/component";
import { html } from "./../../lib";

import { button, icon } from "./../shared";

export interface Props {}

export class Footer extends Component {
  render() {
    return html`
        <footer class="page_footer">
            <p class="page_footer__text">
                &copy ${new Date().getFullYear()} GTxmotorsports. All rights reserved.
            </p>
            <a>${icon("arrow_drop_up")} To Top</a>
        </footer>
    `;
  }
}
