import { Component } from "./../../lib/component";
import { html } from "./../../lib";

import { icon } from "./../shared";

export interface Props {}

export class Footer extends Component {
  onMount = () => {
    const btn = document.getElementById("js-to-top");
    btn && btn.addEventListener("click", this.handleClick);
  };

  onUnmount = () => {
    const btn = document.getElementById("js-to-top");
    btn && btn.removeEventListener("click", this.handleClick);
  };

  handleClick = () => {
    type n = number;
    // by R. Penner http://gizma.com/easing/
    const easeInQuad = function(t: n, b: n, c: n, d: n) {
      t /= d;
      return c * t * t + b;
    };

    const scrollTo = (element: Element, top: number, duration: number) => {
      const start = element.scrollTop;
      const difference = top - start;
      let lastTStamp: number | null = null;

      const moveScroll = (timeLeft: number = 0) => {
        const calcPos = easeInQuad(timeLeft, start, difference, duration);
        element.scrollTop = calcPos;

        timeLeft < duration &&
          requestAnimationFrame(tstamp => {
            const updTimeLeft = lastTStamp
              ? timeLeft + (tstamp - lastTStamp)
              : timeLeft;

            lastTStamp = tstamp;

            moveScroll(updTimeLeft);
          });
      };
      moveScroll();
    };

    scrollTo(document.querySelector("html")!, 0, 500);
  };

  render() {
    return html`
        <footer class="page_footer">
            <p class="page_footer__text">
                &copy ${new Date().getFullYear()} GTxmotorsports. All rights reserved.
            </p>
            <a class="page_footer__link" id="js-to-top">${icon(
              "arrow_drop_up"
            )} To Top</a>
        </footer>
    `;
  }
}
