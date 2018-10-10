import { Component } from "./../../lib/component";
import { State } from "./../../store";
import * as effects from "./../../effects";

import template from "./template";

export interface Props {
  loadStatus: number;
}

export class Preloader extends Component {
  props = ["loadStatus", "currentPart"];

  onMount = () => {
    const { currentPart } = this.model.getState();
    currentPart !== undefined && effects.getImages(currentPart);
  };

  render() {
    const state = <State>this.model.getState();
    const { loadStatus } = state;

    return template({ loadStatus });
  }
}
