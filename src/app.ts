import { IModel } from "./lib/model";
import { container } from "./lib/IOC";
import { types } from "./lib/IOC/types";
import { run, html } from "./lib";
import { State } from "./store";

import { Component } from "./lib/component";

import { Preloader } from "./components/preloader";
import { Page } from "./components/page";

export class App extends Component {
  props = ["isLoading"];

  constructor(model: IModel) {
    super(model);
  }

  onMount() {
    console.log("MOUNTED APP");
  }

  onUnmount() {
    console.log("WILL UNMOUNT APP");
  }

  onUpdate() {
    console.log("UPDATED APP");
  }

  render(): HTMLTemplateElement {
    const state = this.model.getState();

    // return html`
    //     <div class="container">
    //         ${run(Page, this)}
    //     </div>`;

    return html`
        <div class="container">
            ${state.isLoading ? run(Preloader, this) : run(Page, this)}
        </div>`;
  }
}
