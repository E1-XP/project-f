import "reflect-metadata";
import { Container } from "inversify";

import { types } from "./types";

import { Model } from "./../model";
import { Router } from "./../router";
import { Component } from "./../component";

export const container = new Container();

container.bind(types.Component).to(Component);

container
  .bind(types.Model)
  .to(Model)
  .inSingletonScope();

container
  .bind(types.Router)
  .to(Router)
  .inSingletonScope();
