# Project-F

F like framework. I've always wanted to know how it works under the hood. The way modern frameworks magically binds state to view. Diffs and trees. So I created my own. It was a challenge, but I learned a lot.

## Screenshots

![App Screenshot](https://images.ctfassets.net/ysju8du0bph9/72vUHKf8VGTsOEKGOlVzf7/e203839929f104c27226ce08f5f4f8f1/projectf.png)

## Tech Stack

- Typescript
- TSyringe

## Installation

How to run project locally:

1. Install TypeScript:

```bash
  npm install -g typescript
```

2. Add required dependencies (couldn't find a way to fix this the other way)

```bash
  npm i --save-dev @types/lodash.clonedeep
```

3. Install package:

```bash
  npm install -S https://github.com/E1-XP/project-f
```

4. Now Project-F is installed as a dependency in your project.

## Documentation

To mount root node:

```js
import { initApp } from "project-f";

import { App } from "./app";
import { routes } from "./routes";
import { state } from "./state";

const root = document.getElementById("app");

initApp(root, routes, state).renderToDOM(dom);
```

Routes object signature:

```js
export default {
  "/page1": () => ({ isLoading: true, currentPart: 1, currentSlide: 0 }),
  "/page2": () => ({ ...parts of your app state like above }),
};
```

Application State signature:

```js
export default {
  ...your properties
};
```

Basic component (should return html through provided html function):

```js
import { Component, html } from "project-f";

export class App extends Component {
    ...used prop keys here, needed to rerender if changes occur
  props = ['isLoading'];

  render() {
    // we can use model and router classes inside components
    //this.model...
    //this.router...

    return html`<h1>${isLoading ? 'works!' : 'loading'}</h1>`;
  }
}
```

Component nesting:

```js
import { run, html, Component } from "project-f";

import { Preloader } from "./components/preloader";
import { Page } from "./components/page";

export class App extends Component {
  props = ["isLoading"];

  render(): HTMLTemplateElement {
    // this way we can access state
    const { isLoading } = this.model.getState();

    //each component should be wrapped in run function, have unique (on render fn level) key
    // and reference parent class this value
    return html`
      <div class="container">
        ${isLoading ? run(Preloader, "pr", this) : run(Page, "pa", this)}
      </div>
    `;
  }
}
```

Lifecycle and events:

```js
import { Component, html } from "project-f";

import { button } from "./../shared";

export interface Props {}

export class BeforeAfterAd extends Component {
  props = [];

  // accesing elements on component mount and binding handlers
  onMount() {
    const btn = document.getElementById("js-ba-ad");
    btn && btn.addEventListener("click", this.handleClick);
  }

  // removing handlers before unmount to prevent memory leaks
  // also available: onUpdate, shouldUpdate and forceRerender helper
  onUnmount() {
    const btn = document.getElementById("js-ba-ad");
    btn && btn.removeEventListener("click", this.handleClick);
  }

  // provided function to change current route
  handleClick = () => {
    this.router.routeTo("/ba");
  };

  render() {
    return html`
      <aside class="ba_advert">
        <h2 class="ba_advert__heading">
          Let's go backwards and see what it takes to produce image like this.
        </h2>
        ${button("Enter section!", "big", { id: "js-ba-ad" })}
        <div class="ba_advert__background"></div>
      </aside>
    `;
  }
}
```

Gettting/setting state values:

```js
nextSlide = (e: any) => {
  //getting state
  const { currentSlide, images, isSliderRunning } = this.model.getState();

  const onLastSlide = currentSlide >= images.length - 1;

  //setting state
  this.model.setState(() => ({
    currentSlide: onLastSlide ? 0 : currentSlide + 1,
  }));
};
```

Templates can be extracted into own files to separate concerns:

```js
import template from "./template";

...

  render(): HTMLTemplateElement {
    const {
      images,
      currentSlide,
    } = this.model.getState<State>();

    return template({
      images,
      currentSlide,
      getImageList: this.getImageList,
      getLikes: this.getLikes,
      checkIfLiked: this.checkIfLiked,
      parentRef: this
    });
  }


    // template file:
    export default ({
        images,
        getImageList,
        getLikes,
    }: Props) => html`
    <div class="image_slider">
        <section class="image_slider__info"
        ...
        </section>
        ${run(SliderNavigation, "sn", parentRef)}
    </div>
`;
```
