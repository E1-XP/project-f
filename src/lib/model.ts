import { injectable } from "inversify";

import { EventEmitter } from "./observer";
import { State } from "./../store";
import { IComponent } from "./component";

export interface IModel {
  state: Partial<State>;
  createStore: (initialS?: Partial<State>) => Partial<State>;
  getState: () => Partial<State>;
  setState: (updatedS: Partial<State>) => void;
  getDomId: () => number;
}

export interface IvDOMItem {
  ref: IComponent;
  children: IvDOMLevel;
}

export interface IvDOMLevel {
  [key: string]: IvDOMItem;
}

@injectable()
export class Model extends EventEmitter implements IModel {
  private isInitialized = false;
  private domCount = 0;
  state = {};

  constructor() {
    super();
  }

  createStore(initialState?: Partial<State>) {
    if (Object.keys(this.state).length) {
      throw new Error("Store is already initialized");
    }

    if (initialState) {
      this.state = Object.assign({}, this.state, initialState);
    }

    this.isInitialized = true;

    return this.state;
  }

  getState() {
    if (!this.isInitialized) throw new Error("Please initialize store first");
    return this.state;
  }

  setState(updatedS: Partial<State>) {
    this.state = Object.assign({}, this.state, updatedS);
    this.emit(Object.keys(updatedS));

    return this.state;
  }

  getDomId() {
    const tmpId = this.domCount;
    this.domCount += 1;
    return tmpId;
  }
}
