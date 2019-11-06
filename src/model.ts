import { injectable } from "inversify";

import { EventEmitter } from "./observer";
import { IComponent } from "./component";

export interface IModel {
  state: Partial<EmptyState>;
  createStore: (initialS?: Partial<EmptyState>) => Partial<EmptyState>;
  getState: () => Partial<EmptyState>;
  setState: (updatedS: Partial<EmptyState>) => void;
  getDomId: () => number;
}

export interface IvDOMItem {
  ref: IComponent;
  key: string | undefined;
  children: IvDOMLevel;
  parent: IComponent;
}

export interface IvDOMLevel {
  [key: string]: IvDOMItem;
}

export interface EmptyState {
  [key: string]: any;
}

@injectable()
export class Model extends EventEmitter implements IModel {
  private isInitialized = false;
  private domCount = 0;
  private vDOM: any = {};
  state: EmptyState = {};

  createStore(initialState?: Partial<EmptyState>) {
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

  setState(updatedS: Partial<EmptyState>) {
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

  findVDOMNode(
    instance: IComponent,
    vDOM: IvDOMLevel = this.vDOM
  ): IvDOMItem | undefined {
    const queue: IvDOMItem[] = [];
    let checkedElem: IvDOMItem | undefined;

    const innerFn = (child: IvDOMItem) => {
      if (child.ref === instance) return child;
      return undefined;
    };

    Object.values(vDOM).forEach(child => queue.push(child));

    while (queue.length) {
      const currElem = queue.shift()!;

      checkedElem = innerFn(currElem);
      if (checkedElem) return checkedElem;

      Object.values(currElem.children).forEach(child => queue.push(child));
    }

    return undefined;
  }

  appendToVDOM(
    ref: IComponent,
    key?: string,
    parentRef?: IComponent,
    vDOM = this.vDOM
  ) {
    if (!Object.keys(vDOM).length || parentRef === undefined) {
      vDOM[ref.domId] = { ref, key, children: {}, parent: null };
      return;
    }

    const foundItem = this.findVDOMNode(parentRef, vDOM);
    if (!foundItem) {
      throw new Error(`vDOM item (${parentRef.constructor.name}) not found`);
    }

    // const p = (o: any) => {
    //   Object.keys(o).forEach(key => {
    //     console.log(o[key]);
    //     p(o[key].children);
    //   });
    // };

    foundItem.children[ref.domId] = {
      ref,
      key,
      children: {},
      parent: parentRef
    };
    // console.log("log on append");
    // p(vDOM);
  }

  clearVDOMBranch(ref: IComponent) {
    const foundItem = this.findVDOMNode(ref, this.vDOM);
    if (!foundItem) {
      throw new Error(`vDOM item (${ref.constructor.name}) not found`);
    }

    foundItem.children = {};
  }
}
