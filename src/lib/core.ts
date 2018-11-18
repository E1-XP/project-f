import { injectable } from "inversify";

import { container } from "./IOC";
import { types } from "./IOC/types";

import { Model, IvDOMLevel, IvDOMItem } from "./model";
import { Router } from "./router";

import { IComponent } from "./component";

@injectable()
export class AppCore {
  tmpVDOMFragment: IvDOMLevel = {};
  isComparingVDOMs = false;

  run = (component: any, key?: string, parentInstance?: IComponent) => {
    const model = container.get<Model>(types.Model);

    const instance = this.getInstance(component, key, parentInstance);

    model.subscribe(instance);

    const vDOM = this.isComparingVDOMs ? this.tmpVDOMFragment : model.getVDOM();

    model.appendToVDOM(instance, key, parentInstance, vDOM); // can use undefined vars

    console.log("vdom", model.getVDOM());

    if (!this.isComparingVDOMs) setTimeout(instance.onMount, 0);

    console.log(`${instance.constructor.name} Mounted`);

    const template = instance.render().content;
    template.firstElementChild.setAttribute("data-id", instance.domId);

    const tmpElem: any = document.createElement("div");
    tmpElem.appendChild(template);

    return tmpElem.innerHTML;
  };

  getInstance(component: any, key?: string, parentInstance?: IComponent) {
    const model = container.get<Model>(types.Model);
    const router = container.get<Router>(types.Router);

    if (!key) {
      console.log("NEW INSTANCE WITH NO KEY", component);
      return new component(model, router);
    }

    if (this.isComparingVDOMs && !parentInstance) {
      throw new Error(`no parent instance of ${component} found`);
    }

    if (this.isComparingVDOMs && parentInstance) {
      const parent = model.findVDOMNode(parentInstance);

      if (!parent) {
        console.log("NEW INSTANCE", component);
        return new component(model, router);
      }

      const existingInstance = Object.values(parent.children).find(
        entry => entry.key === key
      );

      if (existingInstance) {
        console.log("INSTANCE EXIST", existingInstance);
        return existingInstance.ref;
      }
    }
    console.log("NEW INSTANCE", component);
    return new component(model, router);
  }

  rerender = (instance: IComponent) => {
    console.log("RERENDERING ", instance, instance.domId);

    const model = container.get<Model>(types.Model);
    const vDOM = model.getVDOM();
    const key = model.findVDOMNode(instance)!.key;

    console.log(vDOM);

    this.isComparingVDOMs = true; // start generating vDOMFragment

    model.appendToVDOM(instance, key, undefined, this.tmpVDOMFragment);
    console.log("after append tmp", this.tmpVDOMFragment);
    const vDOMNode = model.findVDOMNode(instance, vDOM);
    if (!vDOMNode) throw new Error(`can't find instance in vDOM`);

    this.unsubscribeChildren(vDOMNode.children);

    const template: any = instance.render(); // multiple run fn calls expected inside render

    this.isComparingVDOMs = false; ////// end

    console.log("now will call lifecycle methods");
    this.callOnUnmountInRemovedChildren(vDOMNode.children);
    this.callLifecycleInRerenderedChildren(this.tmpVDOMFragment);

    model.clearVDOMBranch(instance);
    vDOMNode.children = this.tmpVDOMFragment[instance.domId].children; // set updated children

    this.tmpVDOMFragment = {}; // reset temporary vDOM

    template.content.firstElementChild.setAttribute(
      "data-id",
      instance.domId.toString()
    );

    const mountedElem = document.querySelector(
      `[data-id='${instance.domId}']`
    )!;

    this.updateDOM(mountedElem, template.content);
  };

  private callOnUnmountInRemovedChildren = (vDOMChildren: IvDOMLevel) => {
    const model = container.get<Model>(types.Model);

    Object.values(vDOMChildren).forEach(child => {
      const should =
        !!child.parent && !model.findVDOMNode(child.ref, this.tmpVDOMFragment);

      if (should) {
        console.log("now will call onumnount in", child.ref);
        child.ref.onUnmount();
      }

      this.callOnUnmountInRemovedChildren(child.children);
    });
  };

  private callLifecycleInRerenderedChildren = (vDOMChildren: IvDOMLevel) => {
    Object.values(vDOMChildren).forEach(child => {
      const selectedMethod = this.willComponentExistInNextVDOM(child)
        ? "onUpdate"
        : "onMount";

      console.log(selectedMethod, "will be called on ", child.ref);
      setTimeout(child.ref[selectedMethod], 0);

      this.callLifecycleInRerenderedChildren(child.children);
    });
  };

  private willComponentExistInNextVDOM(vDOMChild: IvDOMItem) {
    const model = container.get<Model>(types.Model);
    // const vDOM = this.isComparingVDOMs ? this.tmpVDOMFragment : model.getVDOM();
    const p = (o: any) => {
      Object.keys(o).forEach(key => {
        console.log(o[key]);
        p(o[key].children);
      });
    };
    console.log("will log tmp");
    p(this.tmpVDOMFragment);
    console.log("will log vdom");
    p(model.getVDOM());
    // if (!this.isComparingVDOMs) return false;
    console.log(vDOMChild, model.getVDOM());

    const previousElement = model.findVDOMNode(vDOMChild.ref);
    // if (!previousElement) {
    //   // console.log("parent not found!");
    //   return true;
    // }

    // const existingInstance = Object.values(parent.children).find(
    //   entry => entry.key === vDOMChild.key
    // );
    // console.log(existingInstance, "exis");
    return !!previousElement;
  }

  private unsubscribeChildren = (vDOMChildren: IvDOMLevel) => {
    const model = container.get<Model>(types.Model);

    const unsubChild = (child: IvDOMItem) => {
      model.unsubscribe(child.ref);
      console.log("UNSUBSCRIBED: ", child.ref, model.listeners.length);

      if (Object.keys(child.children).length) {
        this.unsubscribeChildren(child.children);
      }
    };

    Object.keys(vDOMChildren).forEach(key => {
      unsubChild(vDOMChildren[key]);
    });
  };

  private cloneVDOM(vDOM: IvDOMLevel) {
    // we don't want deep copy, component refs must stay same
    const copy = Object.assign({}, vDOM);

    Object.keys(copy).forEach(key => {
      copy[key].children = this.cloneVDOM(copy[key].children);
    });

    return copy;
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
