import { injectable, inject } from "inversify";
import { types } from "./IOC/types";

import { IComponent } from "./component";
import { AppCore } from "./core";

@injectable()
export class Helpers {
  constructor(@inject(types.AppCore) private core: AppCore) {}

  renderToDOM(app: IComponent, htmlContainer: HTMLElement) {
    const template = document.createElement("template");
    template.innerHTML = this.core.run(app);

    htmlContainer.innerHTML = "";
    htmlContainer.appendChild(template.content);
  }

  html(markup: TemplateStringsArray, ...values: any[]) {
    const arrToString = (arr: (string | HTMLTemplateElement)[]) =>
      arr.reduce((acc, itm) => {
        if (itm instanceof HTMLTemplateElement) {
          return acc + handleTemplate(itm);
        }
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
  }
}
