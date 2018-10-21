import { html } from "./../../lib";

type TbtnContent =
  | string
  | HTMLTemplateElement
  | (string | HTMLTemplateElement)[];

interface Params {
  id?: string;
}

export const button = (
  content: TbtnContent,
  variant?: string,
  props: Params = {}
) => {
  const id = props.id ? `id="${props.id}"` : "";

  return html`
    <button ${id} class="button${variant ? "--" + variant : ""}">
        ${content}
    </button>
`;
};

export const icon = (name: string) => html`
    <span class="material-icons">${name}</span>
`;
