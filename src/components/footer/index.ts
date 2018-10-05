import { Component } from "./../../lib/component";
import { html } from "./../../lib";
export interface Props {}

export class Footer extends Component {
  render() {
    return html`
        <section class="page_footer">
            <p class="page_footer__text">
                &copy ${new Date().getFullYear()} GTxmotorsports. All rights reserved.
            </p>
            <button>To Top</button>
        </section>
    `;
  }
}
