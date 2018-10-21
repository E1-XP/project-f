import { container } from "./IOC";
import { types } from "./IOC/types";

import { IComponent } from "./component";
import { Model, IvDOMLevel, IvDOMItem } from "./model";
import { Router, IRoutes } from "./router";

import { State } from "./../store";

export const initApp = (
  app: IComponent,
  root: HTMLElement,
  routes: IRoutes,
  initialState?: Partial<State>
) => {
  const model = container.get<Model>(types.Model);
  const router = container.get<Router>(types.Router);

  model.createStore(initialState || undefined);
  router.registerRoutes(routes);

  const currRoute = window.location.pathname;
  const handleRootRoute = currRoute === "/" ? "/one" : currRoute;

  router.routeTo(handleRootRoute);
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
  const router = container.get<Router>(types.Router);

  const instance = new component(model, router);

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
  console.log("RERENDERING ", instance, instance.domId);

  const model = container.get<Model>(types.Model);
  const vDOM = model.getVDOM();

  const vDOMNode = model.findVDOMNode(instance, vDOM);
  const vDOMChildren = vDOMNode ? vDOMNode.children : {};

  unsubscribeChildren(vDOMChildren);
  model.clearVDOMBranch(instance);

  const template: any = instance.render().content;
  template.firstElementChild.setAttribute("data-id", instance.domId.toString()); // TODO!!!!!!

  const mountedElem: any = document.querySelector(
    `[data-id='${instance.domId}']`
  );

  updateDOM(mountedElem, template);

  instance.onUpdate();
};

const unsubscribeChildren = (vDOMChildren: IvDOMLevel) => {
  const model = container.get<Model>(types.Model);

  const unsubChild = (child: IvDOMItem) => {
    child.ref.onUnmount();

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

const updateDOM = (currentElement: Element, updatedTemplate: Element) => {
  const tmpElem = document.createElement("div");
  tmpElem.appendChild(updatedTemplate);
  const updatedMarkup = tmpElem.firstElementChild!;

  diffDOMNodes(currentElement, updatedMarkup);
};

const diffDOMNodes = (currentElement: Element, updatedElement: Element) => {
  // no changes
  if (currentElement.isEqualNode(updatedElement)) {
    return;
  }
  // same type, not text node, check attibutes
  if (
    currentElement.nodeName === updatedElement.nodeName &&
    currentElement.nodeType !== 3
  ) {
    const oldAttrs = Array.from(currentElement.attributes);
    const newAttrs = Array.from(updatedElement.attributes);

    const currentChildrenArr = filterEmptyTxtNodes(
      Array.from(currentElement.childNodes)
    );
    const updatedChildrenArr = filterEmptyTxtNodes(
      Array.from(updatedElement.childNodes)
    );

    const hasSameChildrenLength =
      currentChildrenArr.length === updatedChildrenArr.length;

    if (hasSameAttributes(newAttrs, oldAttrs)) {
      // recurse on children
      if (updatedElement.hasChildNodes() && hasSameChildrenLength) {
        currentChildrenArr.forEach((elem, i) =>
          diffDOMNodes(<Element>elem, <Element>updatedChildrenArr[i])
        );

        return;
      }
    } else {
      // replace attrs then recurse
      assignAttributes(updatedElement, currentElement);

      // if same children lenghts
      if (updatedElement.hasChildNodes() && hasSameChildrenLength) {
        currentChildrenArr.forEach((elem, i) =>
          diffDOMNodes(<Element>elem, <Element>updatedChildrenArr[i])
        );

        return;
      }
      // if different children lenghts
      if (updatedElement.hasChildNodes() && currentElement.hasChildNodes()) {
        const currLen = currentChildrenArr.length;
        const updLen = updatedChildrenArr.length;

        const shorterLen = Math.min(currLen, updLen);

        // update existing children
        updatedChildrenArr.forEach((elem, i) => {
          if (i < shorterLen) {
            diffDOMNodes(<Element>currentChildrenArr[i], <Element>elem);
          }
        });

        if (currLen > updLen) {
          // remove existing nodes that are no longer needed
          currentChildrenArr.forEach((elem, i) => {
            if (i >= updLen) {
              currentElement.removeChild(elem);
            }
          });
        }

        // if updatedElem has more childrens than old append them
        if (updLen > shorterLen) {
          const fragment = document.createDocumentFragment();

          updatedChildrenArr.forEach((elem, i) => {
            if (i >= shorterLen) {
              fragment.appendChild(elem);
            }
          });
          currentElement.appendChild(fragment);
        }

        return;
      }
    }
  }

  // different node types, replace element
  const parentElem = currentElement.parentElement;

  if (!updatedElement || !parentElem) {
    throw new Error("DOM error during rerendering process");
  }

  parentElem.replaceChild(updatedElement, currentElement);
};

const filterEmptyTxtNodes = (childrenArr: any[]) =>
  childrenArr.filter(v => {
    if (v.nodeType === 3 && !v.nodeValue!.trim()) return false;
    return true;
  });

const hasSameAttributes = (newAttrs: any[], oldAttrs: any[]) => {
  if (newAttrs.length !== oldAttrs.length) return false;

  const sortedClass = (classes: string) =>
    classes
      ? classes
          .split(" ")
          .sort()
          .join(" ")
      : null;

  const getClassVal = (attr: any[]) => {
    const elem = attr.find(attr => attr.nodeName === "class");
    return elem ? elem.nodeValue : null;
  };

  const newAttrsClasses = sortedClass(getClassVal(Array.from(newAttrs)));
  const oldAttrsClasses = sortedClass(getClassVal(Array.from(oldAttrs)));

  if (newAttrsClasses !== oldAttrsClasses) return false;

  const newAttrsAsArr = Array.from(newAttrs);
  const oldAttrsAsArr = Array.from(oldAttrs);

  const final = newAttrsAsArr.every((attr, i) => {
    if (attr.nodeName === "class") return true;

    const n2ArrayElem = oldAttrsAsArr.find(
      itm => itm.nodeName === attr.nodeName
    );

    return (
      n2ArrayElem !== undefined && n2ArrayElem.nodeValue === attr.nodeValue
    );
  });

  return final;
};

const assignAttributes = (updatedElement: Element, currentElement: Element) => {
  // reset attrs
  for (const attr of <any>currentElement.attributes) {
    currentElement.removeAttribute(attr.name);
  }

  for (const attr of <any>updatedElement.attributes) {
    if (attr.nodeName === "class") {
      attr.nodeValue = attr.nodeValue
        .split(" ")
        .sort()
        .join(" ");
    }

    currentElement.setAttribute(attr.nodeName, attr.nodeValue);
  }
};

export const html = (markup: TemplateStringsArray, ...values: any[]) => {
  const arrToString = (arr: (string | HTMLTemplateElement)[]) =>
    arr.reduce((acc, itm) => {
      if (itm instanceof HTMLTemplateElement) return acc + handleTemplate(itm);

      return acc + itm;
    }, "");

  const handleTemplate = (template: HTMLTemplateElement) => {
    const tmpElem = document.createElement("div");
    tmpElem.appendChild(template.content);

    return tmpElem.innerHTML;
  };

  const getVal = (idx: number) => {
    if (Array.isArray(values[idx])) {
      return arrToString(values[idx]);
    }
    if (values[idx] instanceof HTMLTemplateElement) {
      return handleTemplate(values[idx]);
    }
    return values[idx];
  };

  const template = document.createElement("template");

  template.innerHTML = markup
    .map((str, i) => `${str}${getVal(i) || ""}`)
    .join("");

  return template;
};
