import { html } from "./../../lib";

type TbtnContent =
  | string
  | HTMLTemplateElement
  | (string | HTMLTemplateElement)[];

interface Params {
  id?: string;
  class?: string;
}

export const button = (
  content: TbtnContent,
  variant?: string,
  props: Params = {}
) => {
  const id = props.id ? `id="${props.id}"` : "";
  const additionalClasses = props.class ? " " + props.class : "";

  return html`
    <button ${id} class="button${
    variant ? "--" + variant + additionalClasses : "" + additionalClasses
  }"> ${content}
    </button>
`;
};

export const icon = (name: string) => html`
    <span class="material-icons">${name}</span>
`;
