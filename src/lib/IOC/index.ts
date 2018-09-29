import "reflect-metadata";
import { Container } from "inversify";

import { types } from "./types";

import { IModel, Model } from "./../model";
import { IComponent, Component } from "./../component";

export const container = new Container();

container.bind(types.Component).to(Component);

container
  .bind(types.Model)
  .to(Model)
  .inSingletonScope();
