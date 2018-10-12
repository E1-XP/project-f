import { injectable } from "inversify";
import { rerender } from "./index";
import { IComponent } from "./component";

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

  subscribe(ref: IComponent) {
    if (this.listeners.filter(itm => itm.ref === ref).length) return;

    this.listeners.push({ ref, props: ref.props });
    console.log("ADDED LISTENER", this.listeners);
  }

  unsubscribe(ref: IComponent) {
    this.listeners = this.listeners.filter(itm => itm.ref !== ref);
  }

  emit(propKeys: string[]) {
    console.log("RUN EMIT aka STATE CHANGED", this.listeners);
    // only if props match
    this.listeners.forEach(itm => {
      const { ref, props } = itm;

      if (props.some(key => propKeys.includes(key))) {
        // listeners is modified during loop run so check if still exist here
        this.listeners.includes(itm) && ref.shouldUpdate() && rerender(ref);
      }
    });
  }
}
