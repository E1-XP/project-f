import { injectable, inject } from "tsyringe";
import { types } from "./IOC/types";

import cloneDeep from "lodash.clonedeep";

import { EventEmitter } from "./observer";
import { IComponent } from "./component";
import { AppCore } from "./core";

export interface IModel {
  createStore<S = EmptyState>(initialS?: Partial<S>): Partial<S>;
  getState<S = EmptyState>(): Partial<S>;
  setState<S = EmptyState>(stateCb: StateCb<S>): Partial<S>;
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

type StateCb<S = EmptyState> = (prevS: Partial<S>) => Partial<S>;

@injectable()
export class Model extends EventEmitter implements IModel {
  private isInitialized = false;
  private domCount = 0;
  private vDOM: any = {};

  private state: EmptyState = {};
  private prevState: EmptyState = {};

  constructor(@inject(types.AppCore) core: AppCore) {
    super(core);
  }

  createStore<S = EmptyState>(initialState: Partial<S>) {
    if (Object.keys(this.state).length) {
      throw new Error("Store is already initialized");
    }

    if (initialState) {
      this.state = Object.assign({}, this.state, initialState);
      this.prevState = this.state;
    }

    this.isInitialized = true;

    return <Partial<S>>this.state;
  }

  getState<S = EmptyState>() {
    if (!this.isInitialized) throw new Error("Please initialize store first");
    return <Partial<S>>this.state;
  }

  getPreviousAndCurrentState() {
    const prevS = this.prevState;
    const currS = this.getState();

    return [prevS, currS];
  }

  setState<S = EmptyState>(stateCb: StateCb<S>): Partial<S> {
    const updatedS = stateCb(this.state as S);

    const noStateChanges = Object.entries(updatedS).every(
      ([key, entry]) => this.state[key] === entry
    );

    if (noStateChanges) return <Partial<S>>this.state;

    this.prevState = cloneDeep(this.state);
    this.state = Object.assign({}, this.state, updatedS);
    Object.freeze(this.state);

    this.emit(Object.keys(updatedS));

    return <Partial<S>>this.state;
  }

  emit(propKeys: string[]) {
    super.emit(propKeys);

    this.externalListeners.forEach(cb => cb(this.state));
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

    foundItem.children[ref.domId] = {
      ref,
      key,
      children: {},
      parent: parentRef
    };
  }

  clearVDOMBranch(ref: IComponent) {
    const foundItem = this.findVDOMNode(ref, this.vDOM);
    if (!foundItem) {
      throw new Error(`vDOM item (${ref.constructor.name}) not found`);
    }

    foundItem.children = {};
  }
}
