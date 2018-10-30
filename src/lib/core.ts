import { injectable } from "inversify";

import { container } from "./IOC";
import { types } from "./IOC/types";

import { Model, IvDOMLevel, IvDOMItem } from "./model";
import { Router } from "./router";

import { IComponent } from "./component";

@injectable()
export class AppCore {
  run(component: any, parentInstance?: IComponent): string {
    const model = container.get<Model>(types.Model);
    const router = container.get<Router>(types.Router);

    const instance = new component(model, router);

    model.subscribe(instance);

    model.appendToVDOM(instance, parentInstance || undefined);
    console.log("vdom", model.getVDOM());

    setTimeout(instance.onMount, 0);

    console.log(`${instance.constructor.name} Mounted`);

    const template = instance.render().content;
    template.firstElementChild.setAttribute("data-id", instance.domId);

    const tmpElem: any = document.createElement("div");
    tmpElem.appendChild(template);

    return tmpElem.innerHTML;
  }

  rerender(instance: IComponent) {
    console.log("RERENDERING ", instance, instance.domId);

    const model = container.get<Model>(types.Model);
    const vDOM = model.getVDOM();

    const vDOMNode = model.findVDOMNode(instance, vDOM);
    const vDOMChildren = vDOMNode ? vDOMNode.children : {};

    this.unsubscribeChildren(vDOMChildren);
    model.clearVDOMBranch(instance);

    const template: any = instance.render().content;
    template.firstElementChild.setAttribute(
      "data-id",
      instance.domId.toString()
    );

    const mountedElem: any = document.querySelector(
      `[data-id='${instance.domId}']`
    );

    this.updateDOM(mountedElem, template);

    instance.onUpdate();
  }

  private unsubscribeChildren(vDOMChildren: IvDOMLevel) {
    const model = container.get<Model>(types.Model);

    const unsubChild = (child: IvDOMItem) => {
      child.ref.onUnmount();

      model.unsubscribe(child.ref);
      console.log("UNSUBSCRIBED: ", child.ref, model.listeners.length);

      if (Object.keys(child.children).length) {
        this.unsubscribeChildren(child.children);
      }
    };

    Object.keys(vDOMChildren).forEach(key => {
      unsubChild(vDOMChildren[key]);
    });
  }

  private updateDOM(currentElement: Element, updatedTemplate: Element) {
    const tmpElem = document.createElement("div");
    tmpElem.appendChild(updatedTemplate);
    const updatedMarkup = tmpElem.firstElementChild!;

    this.diffDOMNodes(currentElement, updatedMarkup);
  }

  private diffDOMNodes(currentElement: Element, updatedElement: Element) {
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

      const currentChildrenArr = this.filterEmptyTxtNodes(
        Array.from(currentElement.childNodes)
      );
      const updatedChildrenArr = this.filterEmptyTxtNodes(
        Array.from(updatedElement.childNodes)
      );

      const hasSameChildrenLength =
        currentChildrenArr.length === updatedChildrenArr.length;

      if (this.hasSameAttributes(newAttrs, oldAttrs)) {
        // recurse on children
        if (updatedElement.hasChildNodes() && hasSameChildrenLength) {
          currentChildrenArr.forEach((elem, i) =>
            this.diffDOMNodes(<Element>elem, <Element>updatedChildrenArr[i])
          );

          return;
        }
      } else {
        // replace attrs then recurse
        this.assignAttributes(updatedElement, currentElement);

        // no children
        if (!updatedElement.hasChildNodes()) return;

        // if same children lenghts
        if (updatedElement.hasChildNodes() && hasSameChildrenLength) {
          currentChildrenArr.forEach((elem, i) =>
            this.diffDOMNodes(<Element>elem, <Element>updatedChildrenArr[i])
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
              this.diffDOMNodes(<Element>currentChildrenArr[i], <Element>elem);
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
  }

  private filterEmptyTxtNodes(childrenArr: any[]) {
    return childrenArr.filter(v => {
      if (v.nodeType === 3 && !v.nodeValue!.trim()) return false;
      return true;
    });
  }

  private hasSameAttributes(newAttrs: any[], oldAttrs: any[]) {
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

    const finalCheck = newAttrsAsArr.every((attr, i) => {
      if (attr.nodeName === "class") return true;

      const n2ArrayElem = oldAttrsAsArr.find(
        itm => itm.nodeName === attr.nodeName
      );

      return (
        n2ArrayElem !== undefined && n2ArrayElem.nodeValue === attr.nodeValue
      );
    });

    return finalCheck;
  }

  private assignAttributes(updatedElement: Element, currentElement: Element) {
    // reset attrs
    for (const attr of <any>currentElement.attributes) {
      if (attr.name !== "class") currentElement.removeAttribute(attr.name);
    }

    currentElement.className = updatedElement.className;

    for (const attr of <any>updatedElement.attributes) {
      if (attr.nodeName !== "class") {
        currentElement.setAttribute(attr.nodeName, attr.nodeValue);
      }
    }
  }
}
