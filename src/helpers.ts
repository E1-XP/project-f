import { injectable, inject } from "tsyringe";
import { types } from "./IOC/types";

import { AppCore } from "./core";

@injectable()
export class Helpers {
  constructor(@inject(types.AppCore) private core: AppCore) {}

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
      .map((str, i) => {
        const val = getVal(i);
        return `${str}${val === undefined ? "" : val}`;
      })
      .join("");

    return template;
  }
}
