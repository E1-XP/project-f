import "whatwg-fetch";
const vibrant: any = require("node-vibrant");

import { container } from "./../lib/IOC";
import { types } from "./../lib/IOC/types";
import { Model } from "./../lib/model";

const URL = `https://boiling-citadel-14104.herokuapp.com`;

interface ImageData {
  dir: string;
  thumbnail: string;
  id: number;
  likes: number;
}

interface Response {
  images: ImageData[];
}

export const getImages = (part: number) =>
  fetch(`${URL}/static/img/${part}`)
    .then((resp: any) => resp.json())
    .then(({ images }: Response) => {
      const model = container.get<Model>(types.Model);
      const extractedColors: any[] = [];
      let counter = 0;

      const onLoad = (e: any) => {
        counter += 1;
        const loadStatus = Math.floor((counter / images.length) * 100);

        if (loadStatus === 100) {
          console.log("LOAD IMAGES COMPLETED");

          model.setState({
            images,
            extractedColors,
            isLoading: false,
            loadStatus: 0
          });

          return;
        }

        model.setState({ loadStatus });
        console.log(model.getState(), "MS");
      };

      images.sort((a, b) => a.id - b.id).map(image => {
        const img = new Image();
        img.src = `${URL}/${image.dir}`;

        img.addEventListener("load", onLoad);

        vibrant
          .from(img.src)
          .getPalette()
          .then((result: any) => extractedColors.push(result));
      });
    });
