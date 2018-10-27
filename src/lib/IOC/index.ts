import "reflect-metadata";
import { Container } from "inversify";

import { types } from "./types";

import { AppCore } from "./../core";
import { Helpers } from "./../helpers";
import { Model } from "./../model";
import { Router } from "./../router";
import { Component } from "./../component";

export const container = new Container();

container
  .bind(types.AppCore)
  .to(AppCore)
  .inSingletonScope();

container
  .bind(types.Helpers)
  .to(Helpers)
  .inSingletonScope();

container
  .bind(types.Model)
  .to(Model)
  .inSingletonScope();

container
  .bind(types.Router)
  .to(Router)
  .inSingletonScope();

container.bind(types.Component).to(Component);
