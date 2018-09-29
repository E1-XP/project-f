import { IModel } from "./lib/model";
import { container } from "./lib/IOC";
import { types } from "./lib/IOC/types";
import { run, html } from "./lib";
import { State } from "./store";

import { Component } from "./lib/component";

import { Preloader } from "./components/preloader";
import { Page } from "./components/page";
import { Navigation } from "./components/navigation";

// class Buttons extends Component {
//   // props = ["isLoading"];

//   onMount = () => {
//     const btn: any = document.getElementById("js-btn");
//     btn.addEventListener("click", this.setLoading);
//     console.log(this);
//   };

//   onUnmount() {
//     // const btn: any = document.getElementById("js-btn");
//     // console.log("HERE UMOUNT", btn, document.body);
//     // btn.removeEventListener("click", this.setLoading);
//   }

//   setLoading = () => {
//     console.log(this);
//     this.model.setState({ isLoading: true });
//   };

//   render() {
//     return html`<button id="js-btn">SET LOADING</button>`;
//   }
// }

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

    return html`
        <div class="container">
           ${state.isLoading ? run(Preloader, this) : run(Page, this)}
        </div>`;
  }
}
