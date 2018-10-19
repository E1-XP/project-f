import { html } from "./../../lib";

type TbtnContent =
  | string
  | HTMLTemplateElement
  | (string | HTMLTemplateElement)[];

export const button = (content: TbtnContent, variant?: string) => html`
    <button class="button${variant ? "--" + variant : ""}">
        ${content}
    </button>
`;

export const icon = (name: string) => html`
    <span class="material-icons">${name}</span>
`;
