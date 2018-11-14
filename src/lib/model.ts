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
  parent: IComponent;
}

export interface IvDOMLevel {
  [key: string]: IvDOMItem;
}

interface EmptyState {
  [key: string]: any;
}

@injectable()
export class Model extends EventEmitter implements IModel {
  private isInitialized = false;
  private domCount = 0;
  private vDOM: any = {};
  state: EmptyState = {};

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
    const noStateChanges = Object.entries(updatedS).every(
      ([key, entry]) => this.state[key] === entry
    );

    if (noStateChanges) return this.state;

    this.state = Object.assign({}, this.state, updatedS);

    console.log("UPDATED STATE:", updatedS, this.state);

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

  findVDOMNode(instance: IComponent, vDOM = this.vDOM): IvDOMItem | undefined {
    const keys = Object.keys(vDOM);
    const foundKey = keys.find(key => vDOM[key].ref === instance);

    if (!keys.length) return;
    if (foundKey) return vDOM[foundKey];

    return keys.map(key => this.findVDOMNode(instance, vDOM[key].children))[0];
  }

  appendToVDOM(ref: IComponent, parentRef?: IComponent, vDOM = this.vDOM) {
    if (!Object.keys(vDOM).length || parentRef === undefined) {
      vDOM[ref.domId] = { ref, children: {}, parent: null };
      return;
    }

    const foundItem = this.findVDOMNode(parentRef, vDOM);
    if (!foundItem) {
      throw new Error(`vDOM item (${parentRef.constructor.name}) not found`);
    }

    foundItem.children[ref.domId] = { ref, children: {}, parent: parentRef };
  }

  clearVDOMBranch(ref: IComponent) {
    const foundItem = this.findVDOMNode(ref, this.vDOM);
    if (!foundItem) {
      throw new Error(`vDOM item (${ref.constructor.name}) not found`);
    }

    foundItem.children = {};
  }
}
