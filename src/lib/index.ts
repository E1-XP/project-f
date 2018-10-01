import { container } from "./IOC";
import { types } from "./IOC/types";

import { IComponent } from "./component";
import { Model } from "./model";

export const initApp = () => {
  return {};
};

// types.x = Symbol.for("x");

export const run = (component: any, parentInstance?: IComponent): string => {
  const model = container.get<Model>(types.Model);
  const instance = new component(model);

  setTimeout(instance.onMount, 0);

  model.subscribe(instance);
  console.log(`${instance.constructor.name} Mounted`);

  model.appendToVDOM(instance, parentInstance || undefined);
  console.log("vdom", model.getVDOM());

  const template = instance.render().content;
  template.firstElementChild.setAttribute("data-id", instance.domId);

  const tmpElem: any = document.createElement("div");
  tmpElem.appendChild(template);

  return tmpElem.innerHTML;
};

export const html = (markup: TemplateStringsArray, ...values: any[]) => {
  const template = document.createElement("template");

  const reducedArray = (arr: string[]) =>
    arr.reduce((acc, itm) => acc + itm, "");

  template.innerHTML = markup
    .map(
      (str, i) =>
        `${str}${
          Array.isArray(values[i]) ? reducedArray(values[i]) : values[i] || ""
        }`
    )
    .join("");
  // you can append templates from values arr here
  return template;
};

export const rerender = (instance: IComponent) => {
  instance.onUnmount();
  console.log("RERENDERING ", instance);

  const model = container.get<Model>(types.Model);

  const vDOM = model.getVDOM();
  const vDOMNode = model.findVDOMNode(instance, vDOM);
  console.log(vDOM, vDOMNode, instance, "VDOM, FOUND NODE,instance");
  const vDOMChildren = vDOMNode ? vDOMNode.children : {};

  Object.keys(vDOMChildren).forEach(key =>
    model.unsubscribe(vDOMChildren[key].ref)
  );
  model.clearVDOMBranch(instance);

  const template: any = instance.render().content;
  template.firstElementChild.setAttribute("data-id", instance.domId);

  const tmpElem = document.createElement("div");
  tmpElem.appendChild(template);

  const mountedElem: any = document.querySelector(
    `[data-id='${instance.domId}']`
  );

  console.log(
    // document.body.innerHTML,
    mountedElem,
    "in rerender: body html, mountedElem"
  );
  mountedElem.parentElement.innerHTML = tmpElem.innerHTML;

  instance.onUpdate();
};

export const renderToDOM = (app: IComponent, htmlContainer: HTMLElement) => {
  return null;
  // const template = document.createElement("template");
  // template.innerHTML = run(app);
  // template.cloneNode;
  // // template.content.children[0].dataset.id = String(app.domId);
  // htmlContainer.appendChild(template.content);
};
