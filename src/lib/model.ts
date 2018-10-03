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
  private vDOM: any = {};
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

  getVDOM() {
    return this.vDOM;
  }

  findVDOMNode(instance: IComponent, vDOM: IvDOMLevel): IvDOMItem | undefined {
    const keys = Object.keys(vDOM);
    const foundKey = keys.find(key => vDOM[key].ref === instance);

    console.log(foundKey, vDOM, "FK");

    if (!keys.length) return;
    if (foundKey) return vDOM[foundKey];

    return keys.map(key => this.findVDOMNode(instance, vDOM[key].children))[0];
  }

  appendToVDOM(ref: IComponent, parentRef?: IComponent) {
    if (!Object.keys(this.vDOM).length || parentRef === undefined) {
      this.vDOM[ref.domId] = { ref, children: {} };
      return;
    }

    const foundItem = this.findVDOMNode(parentRef, this.vDOM);
    if (!foundItem) {
      console.log(this.vDOM);
      throw new Error(`vDOM item (${parentRef.constructor.name}) not found`);
    }

    foundItem.children[ref.domId] = { ref, children: {} };
  }

  clearVDOMBranch(rootRef: IComponent) {
    const foundItem = this.findVDOMNode(rootRef, this.vDOM);
    if (!foundItem) {
      // console.log(this.vDOM);
      throw new Error(`vDOM item (${rootRef.constructor.name}) not found`);
    }

    foundItem.children = {};
  }
}
