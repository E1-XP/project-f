import { run, html } from "./lib";

import { Component } from "./lib/component";

import { Preloader } from "./components/preloader";
import { Page } from "./components/page";

export class App extends Component {
  props = ["isLoading"];

  render(): HTMLTemplateElement {
    const { isLoading } = this.model.getState();

    return html`
        <div class="container">
            ${isLoading ? run(Preloader, this) : run(Page, this)}
        </div>`;
  }
}
