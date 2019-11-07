import { injectable, inject } from "inversify";
import { types } from "./IOC/types";

import { IComponent } from "./component";
import { AppCore } from "./core";

export interface Listener {
  ref: IComponent;
  props: string[];
}

export interface IEventEmitter {
  listeners: Listener[];
  subscribe: (ref: IComponent) => void;
  unsubscribe: (ref: IComponent) => void;
  emit: (propKeys: string[]) => void;
}

@injectable()
export abstract class EventEmitter implements IEventEmitter {
  listeners: Listener[] = [];

  constructor(@inject(types.AppCore) private core: AppCore) {}

  subscribe = (ref: IComponent) => {
    if (this.listeners.find(itm => itm.ref === ref)) return;

    this.listeners.push({ ref, props: ref.props });
    console.log("ADDED LISTENER", this.listeners);
  };

  unsubscribe = (ref: IComponent) => {
    this.listeners = this.listeners.filter(itm => itm.ref !== ref);
  };

  emit = (propKeys: string[]) => {
    console.log("RUN EMIT aka STATE CHANGED", this.listeners);
    // only if props match
    this.listeners.forEach(itm => {
      const { ref, props } = itm;

      if (props.some(key => propKeys.includes(key))) {
        // listeners array is modified during loop run so check if still exist here
        const should = this.listeners.includes(itm) && ref.shouldUpdate();
        should && this.core.rerender(ref);
      }
    });
  };
}
