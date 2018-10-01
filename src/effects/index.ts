import "whatwg-fetch";

import { container } from "./../lib/IOC";
import { types } from "./../lib/IOC/types";
import { Model } from "./../lib/model";
import { State } from "./../store";
const URL = `https://boiling-citadel-14104.herokuapp.com`;

interface ImageData {
  dir: string;
}

interface Response {
  images: ImageData[];
}

export const getImages = (part: number) =>
  fetch(`${URL}/static/img/${1}`)
    .then((resp: any) => resp.json())
    .then(({ images }: Response) => {
      const model = container.get<Model>(types.Model);
      const imageCache: HTMLImageElement[] = [];
      let counter = 0;
      // setInterval(() => model.setState({ loadStatus: (counter += 1) }), 1500);

      const onLoad = (e: any) => {
        counter += 1;
        const loadStatus = Math.floor((counter / images.length) * 100);
        const state: Partial<State> = { loadStatus, imageCache };

        if (loadStatus === 100) state.isLoading = false;
        model.setState(state);
      };

      images.map(image => {
        const img = new Image();
        img.src = `${URL}/${image.dir}`;
        imageCache.push(img);

        img.addEventListener("load", onLoad);
      });
    });
