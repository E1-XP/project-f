import "whatwg-fetch";
const vibrant: any = require("node-vibrant");

import { container } from "./../lib/IOC";
import { types } from "./../lib/IOC/types";
import { Model } from "./../lib/model";

import { ImageData } from "./../store";

const URL = `https://boiling-citadel-14104.herokuapp.com`;

interface Response {
  images: ImageData[];
}

interface IuData {
  [key: string]: boolean[];
}

export const getImages = (part: number) =>
  fetch(`${URL}/static/img/${part}`)
    .then((resp: any) => resp.json())
    .then(({ images }: Response) => {
      const model = container.get<Model>(types.Model);
      const extractedColors: any[] = [];

      let counter = 0;

      images.sort((a, b) => a.id - b.id).map((image, i) => {
        const img = new Image();

        img.addEventListener("load", (e: any) => {
          vibrant
            .from(img.src)
            .getPalette()
            .then((result: any) => {
              extractedColors[i] = result;

              counter += 1;
              const loadStatus = Math.floor((counter / images.length) * 100);

              if (loadStatus === 100) {
                model.setState({
                  images,
                  extractedColors,
                  isLoading: false,
                  loadStatus: 0
                });

                return;
              }

              model.setState({ loadStatus });
            });
        });

        img.src = `${URL}/${image.dir}`;
      });
    });

export const addLike = (part: number, currentImage: number) =>
  fetch(`${URL}/likes/new/${part}/${currentImage}/`, {
    method: "POST"
  })
    .then((resp: any) => resp.json())
    .then((data: any) => {
      const model = container.get<Model>(types.Model);
      const { images } = model.getState();

      const updatedImages = images.slice();
      updatedImages[currentImage].likes = data.likes;

      const uData = localStorage.getItem("data");
      if (uData) {
        const parsedData: IuData = JSON.parse(uData);

        parsedData[part][currentImage] = true;
        localStorage.setItem("data", JSON.stringify(parsedData));
      }

      model.setState({ images: updatedImages });
    });

export const populateLocalStorage = () => {
  const alreadyExist = localStorage.getItem("data");
  if (alreadyExist) return;

  const uData: IuData = {};

  Array(4)
    .fill(null)
    .map((_, i) => {
      uData[i + 1] = Array(27)
        .fill(null)
        .map((_, i) => false);
    });

  localStorage.setItem("data", JSON.stringify(uData));

  return uData;
};
