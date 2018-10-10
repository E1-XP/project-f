import { container } from "./IOC";
import { types } from "./IOC/types";

import { IComponent } from "./component";
import { Model, IvDOMLevel, IvDOMItem } from "./model";

import { State } from "./../store";

export const initApp = (
  app: IComponent,
  root: HTMLElement,
  initialState?: Partial<State>
) => {
  const model = container.get<Model>(types.Model);
  model.createStore(initialState || undefined);

  renderToDOM(app, root);
};

export const renderToDOM = (app: IComponent, htmlContainer: HTMLElement) => {
  const template = document.createElement("template");
  template.innerHTML = run(app);

  htmlContainer.innerHTML = "";
  htmlContainer.appendChild(template.content);
};

export const run = (component: any, parentInstance?: IComponent): string => {
  const model = container.get<Model>(types.Model);
  const instance = new component(model);

  model.subscribe(instance);
  console.log(`${instance.constructor.name} Mounted`);

  model.appendToVDOM(instance, parentInstance || undefined);
  console.log("vdom", model.getVDOM());

  setTimeout(instance.onMount, 0);

  const template = instance.render().content;
  template.firstElementChild.setAttribute("data-id", instance.domId);

  const tmpElem: any = document.createElement("div");
  tmpElem.appendChild(template);

  return tmpElem.innerHTML;
};

export const rerender = (instance: IComponent) => {
  instance.onUnmount();

  console.log("RERENDERING ", instance, instance.domId);

  const model = container.get<Model>(types.Model);
  const vDOM = model.getVDOM();
  console.log(model.listeners, vDOM, "listrs,vdom");

  const vDOMNode = model.findVDOMNode(instance, vDOM);
  console.log(vDOM, vDOMNode, instance, "VDOM, FOUND NODE,instance");
  const vDOMChildren = vDOMNode ? vDOMNode.children : {};

  unsubscribeChildren(vDOMChildren);
  console.log("AFTER:", model.listeners, vDOM, "listrs,vdom");

  model.clearVDOMBranch(instance);

  const template: any = instance.render().content;
  template.firstElementChild.setAttribute("data-id", instance.domId.toString());

  const tmpElem = document.createElement("div");
  tmpElem.appendChild(template);

  const mountedElem: any = document.querySelector(
    `[data-id='${instance.domId}']`
  );

  // you can compare elements and change attributes only if same types
  console.log(mountedElem, mountedElem.parentElement);

  mountedElem.parentElement.replaceChild(
    tmpElem.firstElementChild,
    mountedElem
  );

  instance.onUpdate();
};

const unsubscribeChildren = (vDOMChildren: IvDOMLevel) => {
  const model = container.get<Model>(types.Model);

  const unsubChild = (child: IvDOMItem) => {
    model.unsubscribe(child.ref);
    console.log("UNSUBSCRIBED: ", child.ref, model.listeners.length);

    if (Object.keys(child.children).length) {
      unsubscribeChildren(child.children);
    }
  };

  Object.keys(vDOMChildren).forEach(key => {
    unsubChild(vDOMChildren[key]);
  });
};

export const html = (markup: TemplateStringsArray, ...values: any[]) => {
  const template = document.createElement("template");

  const arrToString = (arr: string[]) =>
    arr.reduce((acc, itm) => acc + itm, "");

  template.innerHTML = markup
    .map((str, i) => {
      const val = Array.isArray(values[i]) ? arrToString(values[i]) : values[i];

      return `${str}${val || ""}`;
    })
    .join("");

  return template;
};
