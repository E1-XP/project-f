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
  template.innerHTML = markup
    .map((str, i) => `${str}${values[i] || ""}`)
    .join("");
  // you can append templates from values arr here
  return template;
};

export const renderToDOM = (app: IComponent, htmlContainer: HTMLElement) => {
  return null;
  // const template = document.createElement("template");
  // template.innerHTML = run(app);
  // template.cloneNode;
  // // template.content.children[0].dataset.id = String(app.domId);
  // htmlContainer.appendChild(template.content);
};
